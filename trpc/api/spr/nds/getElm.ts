import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { ICurrency } from "@/db/Entitys/Currency"; 

const requestShema = z.object({
  id: z.number()
})

export const currencySprGetElm = router({
  getElm: publicProcedure
  .input(requestShema)
  .query(async (opts) => {
    const { input } = opts;

    //console.log(input.firmId)
    const { pool } = opts.ctx as Context;
    
    const query: string = format(`
      SELECT * FROM currency AS c
      WHERE c.id = %1$L
      ORDER BY name;`, input.id);
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