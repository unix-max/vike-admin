import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { IFirm } from "@/db/Entitys/Firm"; 

const requestShema = z.object({
  firmId: z.number()
})

export const firmSprGetElm = router({
  getElm: publicProcedure
  .input(requestShema)
  .query(async (opts) => {
    const { input } = opts;

    //console.log(input.firmId)
    const { pool } = opts.ctx as Context;
    let firm: IFirm ={ id:0 };

    const query: string = format(`
        SELECT * FROM firm AS c
        WHERE c.id = %1$L
        ORDER BY name;`, input.firmId);
   
    try {
      
      const dbClient = await pool.connect();
      const res = await dbClient.query(query);
      dbClient.release();
      
      firm = res.rows[0] as IFirm;
      //console.log(res2);
      return {elm: firm, tc: pool.totalCount, ic: pool.idleCount}
    } catch(err) {
      console.log("Error", err);
    }
    
  })
})