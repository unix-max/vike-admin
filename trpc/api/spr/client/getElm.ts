import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { IClient, IClientCatalog } from '@/db/Entitys/Client'

const requestShema = z.object({
  tName: z.string(),
  tData: z.string().array().nonempty(),
  id: z.number()
})

export const clientSprGetElm = router({
  getElm: publicProcedure
  .input(requestShema)
  .query(async (opts) => {
    const { input } = opts;

    let all:boolean = input.tData[0] == 'all' ? true: false;
  
    const { pool } = opts.ctx as Context;
    let clientList: IClient ={id:0};
    let query:string;

      query = format(`
        SELECT ${all ? '*': 'c.id, c.path, c.type, %1$I'} 
        FROM %2$I AS c
        WHERE c.id = %3$L
        ORDER BY name;`, input.tData, input.tName, input.id);
        console.log(query)
    try {
      const dbClient = await pool.connect();
      const res = await dbClient.query(query);
      dbClient.release();
      clientList = res.rows[0] as IClient;
      return {elm: clientList, tc: pool.totalCount, ic: pool.idleCount}
    } catch(err) {
      console.log("Error", err);
    }
    
  })
})