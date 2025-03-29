import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';

export type RateRecDto = {
  id: number;
  curId: number;
  begin: string;
  rate: number
}

const requestShema = z.object({
  id: z.number()
})

type reqDataType =  z.infer<typeof requestShema>

export const currencySprGetRateList = router({
  getRateList: publicProcedure
    .input(requestShema)
    .query(async (opts) => {
      const input = opts.input as reqDataType;
      const { pool } = opts.ctx as Context;
      
      const query =format(`
        SELECT * FROM currency_rate
        WHERE currency_id = %1$L
        ORDER BY begin DESC;`,input.id);
      console.log(query)

      try {
        const dbClient:PoolClient = await pool.connect();
        const res = await dbClient.query(query);
        dbClient.release();

        const list:RateRecDto[] = res.rows;
        return {list: list, tc: pool.totalCount, ic: pool.idleCount}
      } catch(err) {
        console.log("Error", err);
      }
      
    })
})