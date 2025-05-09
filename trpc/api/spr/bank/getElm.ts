import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { ICity } from "@/db/Entitys/spr/City"; 

const requestShema = z.object({
  id: z.number()
})

type reqDataType =  z.infer<typeof requestShema>

export const bankSprGetElm = router({
  getElm: publicProcedure
  .input(requestShema)
  .query(async (opts) => {
    const input = opts.input as reqDataType;

    //console.log(input.firmId)
    const { pool } = opts.ctx as Context;
    
    let query = format(`
    SELECT 
    b.id AS bank_id,
    b.name AS bank_name,
    b.bik AS bank_bik,
    b.coraccount AS bank_coraccount,
    b.city AS bank_city,
    b.alias AS bank_alias,
    c.id AS city_id,
    c.name AS city_name
    FROM bank AS b
    LEFT JOIN city AS c ON c.id = b.city
    WHERE b.id = %1$L
    ;`, input.id);
    //console.log(query)
    
    try {
      
      const dbClient = await pool.connect();
      const res = await dbClient.query(query);
      dbClient.release();
      
      const b = res.rows[0];
      const elm = {id: b.bank_id, name: b.bank_name, bik: b.bank_bik, coraccount: b.bank_coraccount, alias: b.bank_alias,
        city:b.city_name
      }
      //console.log(res2);
      return {elm: elm, tc: pool.totalCount, ic: pool.idleCount}
    } catch(err) {
      console.log("Error", err);
    }
    
  })
})