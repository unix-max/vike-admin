import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { ICity } from "@/db/Entitys/City"; 

const requestShema = z.object({
  id: z.number()
})

export const skladSprGetElm = router({
  getElm: publicProcedure
  .input(requestShema)
  .query(async (opts) => {
    const { input } = opts;

    //console.log(input.firmId)
    const { pool } = opts.ctx as Context;
    
    let query = format(`
     SELECT 
        s.id AS sklad_id,
        s.name AS sklad_name,
        s.indoc AS sklad_indoc,
        s.mol AS sklad_mol_id,
        m.id AS mol_id,
        m.human AS mol_human_id,
        h.id AS human_id,
        h.nic AS human_nic
      FROM sklad AS s
      LEFT JOIN firm_employee AS m ON m.id = s.mol
      LEFT JOIN human AS h ON h.id = m.human
      WHERE s.id = %1$L
      ORDER BY s.name;`, input.id);
    //console.log(query)
    
    try {
      
      const dbClient = await pool.connect();
      const res = await dbClient.query(query);
      dbClient.release();
      
      const item = res.rows[0];
      const elm = { id: item.sklad_id, name: item.sklad_name, indoc: item.sklad_indoc, 
        mol: item.human_nic}
      //console.log(res2);
      return {elm: elm, tc: pool.totalCount, ic: pool.idleCount}
    } catch(err) {
      console.log("Error", err);
    }
    
  })
})