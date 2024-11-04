// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import { open } from 'node:fs/promises';
import xml from 'fast-xml-parser';
import { IClient, IClientCatalog } from '@/db/Entitys/Client'
import { string } from 'prop-types';
const {XMLParser, XMLBuilder, XMLValidator} = xml;


const query = `
    INSERT INTO client
    (
          path
        , old_code
        , type
        , name
        , inDoc
        , inn
        , kpp
        , ogrn
        , address
        , urAddress
        , phone
        , created
        , updated
    )
    VALUES
    (
          $1 --path
        , $2 --old_code
        , $3 --type
        , $4 --name
        , $5 --inDoc
        , $6 --inn
        , $7 --kpp
        , $8 --ogrn
        , $9 --address
        , $10 --urAddress
        , $11 --phone
        ,NOW() --created
        ,NOW() --updated
    )
    RETURNING id
    `;

	export const clientSprLoadTable = router({
    loadTable: publicProcedure.query(async (opts) => {
			const { pool } = opts.ctx as Context;
			let dbClient: PoolClient | undefined;
			const clientCatalog: IClientCatalog = {};
    
			try {
        dbClient = await pool.connect();
        // Using the filehandle method
				const file = await open('Export.xml', 'r+');
        var data = await file.readFile("utf8");
        await file.close();

        const options = {
          ignoreAttributes: false,
          attributeNamePrefix : "@_",
          allowBooleanAttributes: true,
          parseAttributeValue: true
        };
        const parser = new XMLParser(options);
        const jsonObj = parser.parse(data);

        const clients = jsonObj.Данные.Справочники.Клиенты.Клиент;
        //console.log(clients.length);

        // Создаем тразакцию
        await dbClient.query('BEGIN')

        for (let i=0; i < clients.length; i++) {
            let client = clients[i];
            let cl:IClient = {id: 0}
            
            if (typeof client['@_Код'] != 'number') continue; 
            cl.oldCode = client['@_Код'];

            if (client['@_Type'] == 'F') {
                cl.type = 'F';
            } else if (client['@_Type'] == 'E') {           
                cl.type = 'E';    
            }

            //console.log(client['@_Родитель'])
            if (client['@_Родитель']) {
                cl.parentId = parseInt(client['@_Родитель'], 10);
                const parent = clientCatalog[cl.parentId];
                if (!parent?.id)  throw new Error('Не определен id предка для построения пути');
                cl.path = parent.path ? parent.path+'.'+ String(parent.id) : String(parent.id);  
            }
            
            cl.name = client['@_Наименование'];
            cl.inn = client['@_ИНН'];
            cl.kpp = client['@_КПП'];
            cl.ogrn = client['@_ОГРН'];
            cl.phone = client['@_ОсновнойТелефон'];
            cl.inDoc = client['@_ВДокументы']; 
            cl.address = client['@_Адрес'];
            cl.urAddress = client['@_ЮрАдрес'];
            //console.log(cl);
        
             const qVal = [
                cl.path,   //$1
                cl.oldCode, //$2
                cl.type,    //$3
                cl.name,   //$4
                cl.inDoc,  //$5 
                cl.inn,    //$6
                cl.kpp,    //$7
                cl.ogrn,   //$8
                cl.address,    //$9
                cl.urAddress,  //$10
                cl.phone   //$11
            ]
            
            const res = await dbClient.query(query, qVal);
            cl.id = res.rows[0].id;
            clientCatalog[cl.oldCode] = cl;
        }
        await dbClient.query('COMMIT');
       
    } catch (e) {
        console.log("Error", e);
        await dbClient?.query('ROLLBACK');
    }  finally {
        await dbClient?.release();
    }

	})
})



