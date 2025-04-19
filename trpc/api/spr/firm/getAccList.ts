import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { IFirmAccount } from "@/db/Entitys/FirmAccount"; 

export type accListRecDto = {
  id: number;
  name: string;
  number: string
  [key: string]: any;
}
const requestShema = z.object({
  firmId: z.number()
})

export const firmAccSprGetList = router({
  getAccList: publicProcedure
  .input(requestShema)
  .query(async (opts) => {
    const { input } = opts;
    //console.log(input.firmId)

    const { pool } = opts.ctx as Context;   
    const query =  format(`
      SELECT
      a.id AS firm_acc_id,
      a.firm_id AS firm_id,
      a.type AS firm_acc_type,
      a.name AS firm_acc_name,
      a.number AS firm_acc_number,
      a.bank AS firm_acc_bank_code,
      a.currency AS firm_acc_currency_code,
      a.alias AS firm_acc_alias,
      a.created AS firm_acc_created,
      a.updated AS firm_acc_updated,
      t.id AS type_acc_id,
      t.name AS type_acc_name,
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
      firm_account as a
      LEFT JOIN account_type AS t ON t.id = a.type
      LEFT JOIN currency AS V ON v.id = a.currency
      LEFT JOIN bank as b on a.bank = b.id
      LEFT JOIN city as c ON c.id = b.city
      WHERE a.firm_id = %1$L;`, input.firmId);
    try {
      const dbClient:PoolClient = await pool.connect();
      const res = await dbClient.query(query);
      dbClient.release();
      const firmAccs  = res.rows.map((item, i, arr) => {
        return {
          id: item.firm_acc_id,
          name: item.firm_acc_name,
          number: item.firm_acc_number,
          currency: {code: item.currency_acc_code, name: item.currency_acc_name, sokr: item.currency_acc_sokr, symbol: item.currency_acc_symbol},
          type: {id: item.type_acc_id, name: item.type_acc_name},
          bank: {bik: item.bank_acc_bik, name: item.bank_acc_name, corAccount: item.bank_acc_coraccount,
            city: {id: item.city_acc_id, name: item.city_acc_name, fullName: item.city_acc_fullname }
          },
          alias: item.firm_acc_alias,
          main: item.firm_acc_main,
          created: item.firm_acc_created,
          updated: item.firm_acc_updated
        } as accListRecDto;
      });
      
      //console.log(firmAccs);
      return {list: firmAccs, tc: pool.totalCount, ic: pool.idleCount}
    } catch(err) {
      console.log("Error", err);
    }
    
  })
})