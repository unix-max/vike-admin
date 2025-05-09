import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { IClient, IClientCatalog } from '@/db/Entitys/spr/Client'

const requestShema = z.object({
  id: z.number()
})


export const clientSprGetElm = router({
  getElm: publicProcedure
  .input(requestShema)
  .query(async (opts) => {
    const { input } = opts;
    console.log(input.id)
    
    const { pool } = opts.ctx as Context;

    const query: string = format(`
    SELECT * FROM client AS c
    WHERE c.id = %1$L;`, input.id);
 // console.log(query, input.id)

    try {
      const dbClient: PoolClient = await pool.connect();
      const res = await dbClient.query(query);
      dbClient.release();

      const clientList = res.rows[0] as IClient;
      return {elm: clientList, tc: pool.totalCount, ic: pool.idleCount}
    } catch(err) {
      console.log("Error", err);
    }
    
  })
})