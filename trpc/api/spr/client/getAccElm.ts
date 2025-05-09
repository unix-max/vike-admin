import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { IClientAccount } from "@/db/Entitys/spr/ClientAccount"; 

const requestShema = z.object({
  id: z.number()
})

export const clientAccSprGetElm = router({
  getAccElm: publicProcedure
  .input(requestShema)
  .query(async (opts) => {
    const { input } = opts;
    //console.log(input.id)

    const { pool } = opts.ctx as Context;   
    const query =  format(`
      SELECT
      a.id AS client_acc_id,
      a.client_id AS client_id,
      a.type AS client_acc_type,
      a.name AS client_acc_name,
      a.number AS client_acc_number,
      a.bank AS client_acc_bank_code,
      a.currency AS client_acc_currency_id,
      a.alias AS client_acc_alias,
      a.created AS client_acc_created,
      a.updated AS client_acc_updated,
      t.id AS type_acc_id,
      t.name AS type_acc_name,
      v.id AS currency_acc_id,
      v.code AS currency_acc_code,
      v.sokr AS currency_acc_sokr,
      v.symbol AS currency_acc_symbol,
      v.name AS currency_acc_name,
      b.bik AS bank_acc_bik,
      b.name AS bank_acc_name,
      b.coraccount AS bank_acc_coraccount,
      b.city AS bank_acc_city,
      c.id AS city_acc_id,
      c.name AS city_acc_name,
      c.full_name AS city_acc_fullname
      FROM
      client_account as a
      LEFT JOIN account_type AS t ON t.id = a.type
      LEFT JOIN currency AS v ON v.id = a.currency
      LEFT JOIN bank as b on a.bank = b.id
      LEFT JOIN city as c ON c.id = b.city
      WHERE a.id = %1$L;`, input.id);
    try {
      const dbClient:PoolClient = await pool.connect();
      const res = await dbClient.query(query);
      dbClient.release();
      const item = res.rows[0];
      //console.log(item);
      const clientAcc =  {
        id: item.client_acc_id,
        name: item.client_acc_name,
        number: item.client_acc_number,
        currency:  item.currency_acc_name,
        type: item.type_acc_name,
        bank: item.bank_acc_name,
        alias: item.client_acc_alias,
        created: item.client_acc_created,
        updated: item.client_acc_updated
        
        };
      
      //console.log(firmAcc);
      return {elm: clientAcc}
    } catch(err) {
      console.log("Error", err);
    }
    
  })
})