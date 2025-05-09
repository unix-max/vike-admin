import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import { open } from 'node:fs/promises';
import xml from 'fast-xml-parser';
import { ITovar, ITovarCatalog } from '@/db/Entitys/Tovar'
import { string } from 'prop-types';
const {XMLParser, XMLBuilder, XMLValidator} = xml;

const query = `
    INSERT INTO tovar
    (
          old_code
        , path
        , type
        , name
        , okei
	    , oksm
        , nds
        , minost
        , currency_accounting
        , currency_sale
        , created
        , updated

    )
    VALUES
    (
          $1 --oldKod
        , $2 --path
        , $3 --type
        , $4 --name
        , $5 --okei
        , $6 --oksm
        , $7 --nds
        , $8 --minost
        , $9 --currency_accounting
        , $10 --currency_sale
        ,NOW() --created
        ,NOW() --updated
    )
    RETURNING id
    `;


    export const tovarSprLoadTable = router({
      loadTable: publicProcedure.query(async (opts) => {
        const { pool } = opts.ctx as Context;
        let dbClient: PoolClient | undefined;    
    const catalog: ITovarCatalog = {};

    try {
      dbClient = await pool.connect();
        // Using the filehandle method
       const file = await open('ExpTov.xml', 'r+');
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

        const dataJson = jsonObj.Данные.Справочники.Товары.Товар;
        //console.log(clients.length);

        // Создаем тразакцию
        await dbClient.query('BEGIN')

        for (let i=0; i < dataJson.length; i++) {
            let itemJson = dataJson[i];
            let itemLoad:ITovar = {id: 0}
            
            if (typeof itemJson['@_Код'] != 'number') continue; 
            itemLoad.oldCode = itemJson['@_Код'];

            if (itemJson['@_Type'] == 'F') {
                itemLoad.type = 'F';
            } else if (itemJson['@_Type'] == 'E') {           
                itemLoad.type = 'E';    
            }

            //console.log(client['@_Родитель'])
            if (itemJson['@_Родитель']) {
                itemLoad.parentId = parseInt(itemJson['@_Родитель'], 10);
                const parent = catalog[itemLoad.parentId];
                if (!parent?.id)  throw new Error('Не определен id предка для построения пути');
                itemLoad.path = parent.path ? parent.path+'.'+ String(parent.id) : String(parent.id);  
            }
            
            itemLoad.name = itemJson['@_Наименование'];
            itemLoad.okei = 1;
            itemLoad.oksm = 1;
            itemLoad.nds = 5;
            itemLoad.minost = 0;
            itemLoad.currencyAccounting = 1;
            itemLoad.currencySale = 1; 
            //itemLoad.address = itemJson['@_Адрес'];
            //itemLoad.urAddress = itemJson['@_ЮрАдрес'];
            //console.log(cl);
        
             const qVal = [
                itemLoad.oldCode,  //$1
                itemLoad.path, //$2
                itemLoad.type,    //$3
                itemLoad.name,   //$4
                itemLoad.okei,  //$5 
                itemLoad.oksm,    //$6
                itemLoad.nds,    //$7
                itemLoad.minost,    //$8
                itemLoad.currencyAccounting,    //$9
                itemLoad.currencySale   //$10
               // itemLoad.address,    //$10
               // itemLoad.urAddress,  //$11
             
            ]
            //console.log(qVal);
            const res = await dbClient.query(query, qVal);
            itemLoad.id = res.rows[0].id;
            catalog[itemLoad.oldCode] = itemLoad;
        }
        await dbClient.query('COMMIT');
       
    } catch (e) {
        console.log("Error", e);
        await dbClient?.query('ROLLBACK');
    }  finally {
        dbClient?.release();
    }
   
  
    })
  })


