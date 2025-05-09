import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { IFirm } from "@/db/Entitys/spr/Firm";


export const firmSprGetList = router({
  getList: publicProcedure
    .query(async (opts) => {
      const { input } = opts;
      const { pool } = opts.ctx as Context;

      const query = `
          SELECT
            id,
            name,
            inn
          FROM firm
          ORDER BY name;`;
          console.log(query)

      try {
        const dbClient:PoolClient = await pool.connect();
        const res = await dbClient.query(query);
        dbClient.release();
        const list:IFirm[] = res.rows;
        return {list: list, tc: pool.totalCount, ic: pool.idleCount}
      } catch(err) {
        console.log("Error", err);
      }
      
    })
})