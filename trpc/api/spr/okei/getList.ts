import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { IOKEI } from "@/db/Entitys/spr/OKEI";

export const okeiSprGetList = router({
  getList: publicProcedure
    .query(async (opts) => {
      const { input } = opts;
      const { pool } = opts.ctx as Context;
      
      const query = `
        SELECT * FROM okei
        ORDER BY name;`;
      console.log(query)

      try {
        const dbClient:PoolClient = await pool.connect();
        const res = await dbClient.query(query);
        dbClient.release();
        const list:IOKEI[] = res.rows;
        return {list: list, tc: pool.totalCount, ic: pool.idleCount}
      } catch(err) {
        console.log("Error", err);
      }
      
    })
})