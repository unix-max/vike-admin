import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { IFirmAccount } from "@/db/Entitys/FirmAccount"; 

const requestShema = z.object({
  firmId: z.number()
})

export const firmAccSprGetList = router({
  getList: publicProcedure
  .input(requestShema)
  .query(async (opts) => {
    const { input } = opts;
    //console.log(input.firmId)

    const { pool } = opts.ctx as Context;   
    const query =  format(`
      SELECT
      f.id AS firm_acc_id,
      f.firm AS firm_id,
      f.type AS firm_acc_type,
      f.name AS firm_acc_name,
      f.number AS firm_acc_number,
      f.bank AS firm_acc_bank_code,
      f.currency AS firm_acc_currency_code,
      f.alias AS firm_acc_alias,
      f.main AS firm_acc_main,
      f.created AS firm_acc_created,
      f.updated AS firm_acc_updated,
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
      c.fullname AS city_acc_fullname
      FROM
      firm_account as f
      LEFT JOIN account_type AS t ON t.id = f.type
      LEFT JOIN currency AS V ON v.code = f.currency
      LEFT JOIN bank as b on f.bank = b.bik
      LEFT JOIN city as c ON c.id = b.city
      WHERE f.firm = %1$L;`, input.firmId);
    try {
      const dbClient:PoolClient = await pool.connect();
      const res = await dbClient.query(query);
      dbClient.release();
      const firmAccs: IFirmAccount = res.rows.map((item, i, arr) => {
        return {
          id: item.firm_acc_id,
          name: item.firm_acc_name,
          number: item.firm_acc_number,
          currency:  item.currency_acc_sokr,
          type: item.type_acc_name,
          bank: item.bank_acc_name,
          alias: item.firm_acc_alias,
          main: item.firm_acc_main,
          created: item.firm_acc_created,
          updated: item.firm_acc_updated
        }
      });
      
      //console.log(res2);
      return {list: firmAccs, tc: pool.totalCount, ic: pool.idleCount}
    } catch(err) {
      console.log("Error", err);
    }
    
  })
})