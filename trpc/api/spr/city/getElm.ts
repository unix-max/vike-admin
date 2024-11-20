import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { ICity } from "@/db/Entitys/City"; 

const requestShema = z.object({
  id: z.number()
})

export const citySprGetElm = router({
  getElm: publicProcedure
  .input(requestShema)
  .query(async (opts) => {
    const { input } = opts;

    //console.log(input.firmId)
    const { pool } = opts.ctx as Context;
    

    const query: string = format(`
        SELECT * FROM city AS c
        WHERE c.id = %1$L
        ORDER BY name;`, input.id);
   
    try {
      
      const dbClient = await pool.connect();
      const res = await dbClient.query(query);
      dbClient.release();
      
      const city = res.rows[0] as ICity;
      //console.log(res2);
      return {elm: city, tc: pool.totalCount, ic: pool.idleCount}
    } catch(err) {
      console.log("Error", err);
    }
    
  })
})