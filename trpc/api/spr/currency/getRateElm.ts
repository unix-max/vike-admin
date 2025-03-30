import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';

export type ExtRateRecDto = {
  id: number;
  begin: string;
  rate: number;
  cur_id: number;
  sokr: string;
  name: string;
}

const requestShema = z.object({
  id: z.number()
})

type reqDataType =  z.infer<typeof requestShema>

export const currencySprGetRateElm = router({
  getRateElm: publicProcedure
  .input(requestShema)
  .query(async (opts) => {
    const input = opts.input as reqDataType;

    //console.log(input.firmId)
    const { pool } = opts.ctx as Context;
    
    const query: string = format(`
      SELECT
          r.id AS id,
          r.begin AS begin,
          r.rate AS rate,
          c.id AS cur_id,
          c.sokr AS sokr,
          c.name AS name
        FROM currency_rate  AS r
        LEFT JOIN currency AS c ON c.id = r.currency_id
        WHERE r.id = %1$L;`, input.id);

    console.log(query)
    
    try {
      
      const dbClient:PoolClient = await pool.connect();
      const res = await dbClient.query(query);
      dbClient.release();
      
      const currency = res.rows[0] as ExtRateRecDto;
      //console.log(res2);
      return {elm: currency, tc: pool.totalCount, ic: pool.idleCount}
    } catch(err) {
      console.log("Error", err);
    }
    
  })
})