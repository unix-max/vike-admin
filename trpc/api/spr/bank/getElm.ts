import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { ICity } from "@/db/Entitys/City"; 

const requestShema = z.object({
  id: z.number()
})

export const citySprGetElm = router({
  getElm: publicProcedure
  .input(requestShema)
  .query(async (opts) => {
    const { input } = opts;

    //console.log(input.firmId)
    const { pool } = opts.ctx as Context;
    
    let query = format(`
    SELECT 
    c.id AS city_id,
    c.name AS city_name,
    c.full_name AS city_full_name,
    c.oksm AS city_oksm,
    o.id AS oksm_id,
    o.name AS oksm_name
    FROM city AS c
    LEFT JOIN oksm AS o ON o.id = c.oksm
    WHERE c.id = %1$L
    ORDER BY c.name;`, input.id);
    //console.log(query)
    
    try {
      
      const dbClient = await pool.connect();
      const res = await dbClient.query(query);
      dbClient.release();
      
      const city = res.rows[0];
      const elm = {id: city.city_id, name: city.city_name, full_name: city.city_full_name, oksm: city.oksm_name}
      //console.log(res2);
      return {elm: elm, tc: pool.totalCount, ic: pool.idleCount}
    } catch(err) {
      console.log("Error", err);
    }
    
  })
})