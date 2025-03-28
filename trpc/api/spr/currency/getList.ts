import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { ICurrency } from "@/db/Entitys/Currency"; 


export const currencySprGetList = router({
  getList: publicProcedure
    .query(async (opts) => {
      const { input } = opts;
      const { pool } = opts.ctx as Context;
      
      const query = `
        SELECT DISTINCT ON (currency_id)
          r.currency_id AS rate_cur_id,
          r.id AS rate_id,
          r.begin AS rate_begin,
          r.rate AS rate,
          c.id AS id,
          c.code AS code,
          c.sokr AS sokr,
          c.symbol AS symbol,
          c.name AS name,
          c.alias AS alias
        FROM currency_rate  AS r
        LEFT JOIN currency AS c ON c.id = r.currency_id
        WHERE r.begin <= NOW()
        ORDER BY currency_id, BEGIN DESC`;
      console.log(query)

      try {
        const dbClient:PoolClient = await pool.connect();
        const res = await dbClient.query(query);
        dbClient.release();

        const list:ICurrency[] = res.rows;
        return {list: list, tc: pool.totalCount, ic: pool.idleCount}
      } catch(err) {
        console.log("Error", err);
      }
      
    })
})