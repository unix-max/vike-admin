import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { ICurrency } from "@/db/Entitys/Currency"; 

const requestShema = z.object({
  id: z.number()
})

type reqDataType =  z.infer<typeof requestShema>

export const currencySprGetElm = router({
  getElm: publicProcedure
  .input(requestShema)
  .query(async (opts) => {
    const input = opts.input as reqDataType;

    //console.log(input.firmId)
    const { pool } = opts.ctx as Context;
    
    const query: string = format(`
      SELECT DISTINCT ON (currency_id)
          r.currency_id AS rate_cur_id,
          r.id AS rate_id,
          r.begin AS rate_begin,
          r.rate AS rate,
          c.id AS id,
          c.code AS code,
          c.sokr AS sokr,
          c.symbol AS symbol,
          c.name AS name,
          c.alias AS alias
        FROM currency_rate  AS r
        LEFT JOIN currency AS c ON c.id = r.currency_id
        WHERE r.currency_id = %1$L AND r.begin <= NOW()  
        ORDER BY currency_id, begin DESC;`, input.id);

    //console.log(query)
    
    try {
      
      const dbClient:PoolClient = await pool.connect();
      const res = await dbClient.query(query);
      dbClient.release();
      
      const currency = res.rows[0] as ICurrency;
      //console.log(res2);
      return {elm: currency, tc: pool.totalCount, ic: pool.idleCount}
    } catch(err) {
      console.log("Error", err);
    }
    
  })
})