import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
//import { IClient, IClientCatalog } from '@/db/Entitys/spr/Client'


export const schetGetJorn = router({
  getJorn: publicProcedure
    .query(async (opts) => {
//      const { input } = opts;
      const { pool } = opts.ctx as Context;

      const query = `
        SELECT 
        s.id AS schet_id,
        s.date AS schet_date,
        s.firm AS schet_firm_id,
        s.client AS schet_client_id,
        f.name AS schet_firm_name,
        c.name AS schet_client_name,
        (SELECT SUM(sum) FROM schet_doc_tbl AS tbl WHERE tbl.doc_id = s.id) AS sum
        FROM schet_doc AS s
        LEFT JOIN firm AS f ON f.id = s.firm
        LEFT JOIN client AS c ON c.id = s.client
        ORDER BY s.date;`;
      console.log(query)
      try {
        const dbClient:PoolClient = await pool.connect();
        const res = await dbClient.query(query);
        dbClient.release();

        const list = res.rows.map((item) => (
          { id: item.schet_id, date: item.schet_date, firm: item.schet_firm_name, client: item.schet_client_name, 
            sum: item.sum
          }));
        return {list: list, tc: pool.totalCount, ic: pool.idleCount}
      } catch(err) {
        console.log("Error", err);
      }
      
    })
})