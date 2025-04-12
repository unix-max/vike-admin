import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { IFirm } from "@/db/Entitys/Firm"; 

const requestShema = z.object({
  firmId: z.number()
})

type reqDataType =  z.infer<typeof requestShema>

export const firmSprGetElm = router({
  getElm: publicProcedure
  .input(requestShema)
  .query(async (opts) => {
    const input = opts.input as reqDataType;

    //console.log(input.firmId)
    const { pool } = opts.ctx as Context;

    const query: string = format(`
        SELECT * FROM firm AS c
        WHERE c.id = %1$L
        ;`, input.firmId);

        //console.log(query)
   
    try {
      
      const dbClient:PoolClient = await pool.connect();
      const res = await dbClient.query(query);
      dbClient.release();
      const firm = res.rows[0] as IFirm;
      //console.log(res2);
      return {elm: firm, tc: pool.totalCount, ic: pool.idleCount}
    } catch(err) {
      console.log("Error", err);
    }
    
  })
})