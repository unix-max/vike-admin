import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { IClient, IClientCatalog } from '@/db/Entitys/spr/Client'


export const schetDocGetList = router({
  getList: publicProcedure
    .query(async (opts) => {
//      const { input } = opts;
      const { pool } = opts.ctx as Context;

      const query = `
      SELECT 
        s.id AS sklad_id,
        s.name AS sklad_name,
        s.indoc AS sklad_inDoc,
        s.mol AS sklad_mol_id,
        m.id AS mol_id,
        m.human AS mol_human_id,
        h.id AS human_id,
        h.nic AS human_nic
      FROM sklad AS s
      LEFT JOIN firm_employee AS m ON m.id = s.mol
      LEFT JOIN human AS h ON h.id = m.human
      ORDER BY s.name;`;
      console.log(query)
      try {
        const dbClient:PoolClient = await pool.connect();
        const res = await dbClient.query(query);
        dbClient.release();

        const list = res.rows.map((item) => (
          { id: item.sklad_id, name: item.sklad_name, inDoc: item.sklad_inDoc, 
            mol: item.human_nic
          }));
        return {list: list, tc: pool.totalCount, ic: pool.idleCount}
      } catch(err) {
        console.log("Error", err);
      }
      
    })
})