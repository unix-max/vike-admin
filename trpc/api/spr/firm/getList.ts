import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { IClient, IClientCatalog } from '@/db/Entitys/Client'


export const firmSprGetList = router({
  getList: publicProcedure
    .query(async (opts) => {
      const { input } = opts;

      const { pool } = opts.ctx as Context;
      let clientList: IClient[] =[{id:0}];
      let query:string;

        query = `
          SELECT
            id,
            name,
            phone
          FROM firm
          ORDER BY name;`;
          console.log(query)
      try {
        const dbClient = await pool.connect();
        const res = await dbClient.query(query);
        dbClient.release();
        clientList = res.rows;
        return {list: clientList, tc: pool.totalCount, ic: pool.idleCount}
      } catch(err) {
        console.log("Error", err);
      }
      
    })
})