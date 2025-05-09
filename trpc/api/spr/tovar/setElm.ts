import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { ITovar } from "@/db/Entitys/spr/Tovar";

const requestShema =z.object({
  id:         z.number(),
  oldCode:    z.number(),
	path:       z.string(),
  parentId:   z.number(),
	type:       z.string(),
  name:       z.string(),
  okei:       z.number(),
  oksm:       z.number(),
	nds:        z.number(),
  minost:     z.coerce.number(),
	currency_accounting:  z.number(),
  currency_sale:        z.number()
})
.partial()

type genSprElm = {
  [key: string]: any,
  id?: number,
  parentId?: number
}
export const tovarSprSetElm = router({
  setElm: publicProcedure
    .input(requestShema)
    .mutation(async (opts) => {
      const { pool } = opts.ctx as Context;
      const { input } = opts as genSprElm;

      const {id, parentId, ...qData } = input;
      const keys: string[] = Object.keys(qData);
      let vals: (string| number)[] = [];
      keys.forEach((val) => vals.push(qData[val]));
      console.log( keys, vals);

      let query:string;
      if (input.id && input.id > 0) {
        query = format(`
          UPDATE tovar SET (%I, updated) = (%L, now())
          WHERE id = %L RETURNING id;`, keys, vals, input.id);   
        }
      else if (input.parentId && input.parentId > 0) {
        query = format(`
          INSERT INTO tovar (%I, path, created, updated)
          VALUES (%L, ((select path from %1$I where id = %4$L) || %4$L), now(),now())
          RETURNING id;`, keys, vals, input.parentId);
        } 
      else {
        query = format(`
          INSERT INTO tovar (%I, created, updated)
          VALUES (%L, now(),now())
          RETURNING id;`, keys, vals);
      }
      console.log(`${query} `);

      //let client: genSprElm = {id: 0};
      try {
        const dbClient: PoolClient = await pool.connect();
        const res = await dbClient.query(query);
        dbClient.release();
        const elm = res.rows[0] as ITovar;
        return {elm: elm}
      } catch (err: any) {
        return { message: err.message };
        throw new Error(err.message);
      } 

      })
    })