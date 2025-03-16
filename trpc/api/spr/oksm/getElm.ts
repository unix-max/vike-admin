import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { IOKSM } from "@/db/Entitys/OKSM";

const requestShema = z.object({
  id: z.number()
})

export const oksmSprGetElm = router({
  getElm: publicProcedure
  .input(requestShema)
  .query(async (opts) => {
    const { input } = opts;

    //console.log(input.firmId)
    const { pool } = opts.ctx as Context;
    

    const query: string = format(`
        SELECT * FROM oksm AS c
        WHERE c.id = %1$L;`, input.id);
      //console.log(query)
    try {
      
      const dbClient: PoolClient = await pool.connect();
      const res = await dbClient.query(query);
      dbClient.release();
      
      const oksm = res.rows[0] as IOKSM;
      //console.log(oksm);
      return {elm: oksm, tc: pool.totalCount, ic: pool.idleCount}
    } catch(err) {
      console.log("Error", err);
    }
    
  })
})