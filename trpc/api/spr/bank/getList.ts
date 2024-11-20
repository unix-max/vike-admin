import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { ICity } from "@/db/Entitys/City"; 


export const bankSprGetList = router({
  getList: publicProcedure
    .query(async (opts) => {
      const { input } = opts;
      const { pool } = opts.ctx as Context;
      
      let query = `
          SELECT 
          b.id AS bank_id,
          b.bik AS bank_bik,
          b.name AS bank_name,
          b.city AS bank_city,
          c.id AS city_id,
          c.name AS city_name
          FROM bank AS b
          LEFT JOIN city AS c ON b.city = c.id
          ORDER BY b.bik;`;
          console.log(query)
      try {
        const dbClient:PoolClient = await pool.connect();
        const res = await dbClient.query(query);
        dbClient.release();
        const list = res.rows.map((item) => (
          { id: item.bank_id, name: item.bank_name, bik: item.bank_bik, 
            city: item.city_name
          }));
        return {list: list, tc: pool.totalCount, ic: pool.idleCount}
      } catch(err) {
        console.log("Error", err);
      }
      
    })
})