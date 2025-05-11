import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { ISchet, ISchetTbl } from "@/db/Entitys/doc/Schet";


const requestShema = z.object({
  id: z.number()
})

type reqDataType =  z.infer<typeof requestShema>

export const schetGetDoc = router({
  getDoc: publicProcedure
  .input(requestShema)
  .query(async (opts) => {
    const input = opts.input as reqDataType;

    //console.log(input.firmId)
    const { pool } = opts.ctx as Context;
    
    let queryHead = format(`
      SELECT 
        s.id AS schet_id,
        s.number AS schet_number,
        s.date AS schet_date,
        s.firm AS schet_firm_id,
        s.firm_acc AS schet_firm_acc_id,
        s.client AS schet_client_id,
        s.sklad AS schet_sklad_id,
        s.currency AS schet_currency_id,
        s.nds AS schet_nds_id,
        s.descript AS schet_descript,
        f.name AS schet_firm_name,
        acc.name AS schet_acc_name,
        acc.number AS schet_acc_number,
        c.name AS schet_client_name,
        sk.name AS schet_sklad_name,
        cur.name AS schet_cur_name,
        nds.name AS schet_nds_name,
        nds.val AS schet_nds_val
      FROM schet_doc AS s
      LEFT JOIN firm AS f ON f.id = s.firm
      LEFT JOIN firm_account AS acc ON acc.id = s.firm_acc
      LEFT JOIN client AS c ON c.id = s.client
      LEFT JOIN sklad AS sk ON sk.id = s.sklad
      LEFT JOIN currency AS cur ON cur.id = s.currency
      LEFT JOIN nds AS nds ON nds.id = s.nds
      WHERE s.id = %1$L;`, input.id);

      let queryStr = format(`
      SELECT *  FROM schet_doc_tbl
      WHERE doc_id = %1$L;`, input.id);
    //console.log(query)
    
    try {
      
      const dbClient:PoolClient = await pool.connect();
      const dbClient1:PoolClient = await pool.connect();
      const [resHead, resStr] = await Promise.all([dbClient.query(queryHead), dbClient1.query(queryStr)]);
      dbClient.release();
      dbClient1.release();
      
      const itemHead = resHead.rows[0];
      const headData = {
        id: itemHead.schet_id,
        //number: itemHead.number,
        date: itemHead.schet_date, 
        firm: {id: itemHead.schet_firm_id, name: itemHead.schet_firm_name}, 
        firm_acc: {name: itemHead.schet_firm_name, number: itemHead.schet_acc_number},
        client: {id: itemHead.schet_client_name, name:itemHead.schet_client_name},
        sklad: {id: itemHead.schet_sklad_id, name: itemHead.schet_sklad_name},
        currency: {id: itemHead.schet_cur_name, name: itemHead.schet_cur_name},
        nds: {id: itemHead.schet_nds_name, name: itemHead.schet_nds_name, val: itemHead.schet_nds_val},
        descript: itemHead.schet_descript} as ISchet;
        
        const tblData = resStr.rows as ISchetTbl[]
      // const tblData = resStr.rows.map((item, i, arr) => {
      //   return {
      //     id: item.id, tovar: item.tovar, okei: item.okei,
      //     qty: item.qty, price: item.price, sum: item.sum,
      //     nds: item.nds
      //     } as ISchetTbl;
      //   });
      //console.log(res2);
      return {doc: {head: headData, tbl: tblData}, tc: pool.totalCount, ic: pool.idleCount}
    } catch(err) {
      console.log("Error", err);
    }
    
  })
})