import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { ICity } from "@/db/Entitys/City"; 


export const citySprGetList = router({
  getList: publicProcedure
    .query(async (opts) => {
      const { input } = opts;
      const { pool } = opts.ctx as Context;
      
      const query = `
          SELECT 
          c.id AS city_id,
          c.name AS city_name,
          c.full_name AS city_full_name,
          c.oksm AS city_oksm_id,
          o.id AS oksm_id,
          o.code AS oksm_code,
          o.name AS oksm_name
          FROM city AS c
          LEFT JOIN oksm AS o ON o.id = c.oksm
          ORDER BY c.name;`;
          console.log(query)
      try {
        const dbClient:PoolClient = await pool.connect();
        const res = await dbClient.query(query);
        dbClient.release();
        const list = res.rows.map((item) => (
          { id: item.city_id, name: item.city_name, full_name: item.city_full_name, 
            oksm: item.oksm_name
          }));
        return {list: list, tc: pool.totalCount, ic: pool.idleCount}
      } catch(err) {
        console.log("Error", err);
      }
      
    })
})