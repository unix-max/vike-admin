import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { ITovar, ITovarCatalog } from '@/db/Entitys/Tovar'

const requestShema = z.object({
  id: z.number()
})


export const tovarSprGetElm = router({
  getElm: publicProcedure
  .input(requestShema)
  .query(async (opts) => {
    const { input } = opts;
    console.log(input.id)
    
    const { pool } = opts.ctx as Context;

    const query: string = format(`
    SELECT * FROM tovar AS c
    WHERE c.id = %1$L;`, input.id);
 // console.log(query, input.id)

    try {
      const dbClient: PoolClient = await pool.connect();
      const res = await dbClient.query(query);
      dbClient.release();

      const tovarList = res.rows[0] as ITovar;
      return {elm: tovarList, tc: pool.totalCount, ic: pool.idleCount}
    } catch(err) {
      console.log("Error", err);
    }
    
  })
})