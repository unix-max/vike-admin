import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';

const requestShema =z.object({
  id:         z.number(),
  oldCode:    z.number(),
	path:       z.string(),
	type:       z.string(),
  name:       z.string(),
	parentId:   z.number(),
	nomer:      z.number(),
	indoc:      z.string(),
	inn:        z.string(),
	kpp:        z.string(),
	ogrn:       z.string(),
	address:    z.string(),
	urAddress:  z.string(),
	phone:      z.string(),
	email:      z.string(),
	www:        z.string(),
	nds:        z.number(),
	np:         z.number(),

})
.partial()

type genSprElm = {
  [key: string]: any,
  id?: number,
  parentId?: number
}
export const clientSprInsertElm = router({
  insertElm: publicProcedure
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
          UPDATE client SET (%I, updated) = (%L, now())
          WHERE id = %L RETURNING id;`, keys, vals, input.id);   
        }
      else if (input.parentId && input.parentId > 0) {
        query = format(`
          INSERT INTO client (%I, path, created, updated)
          VALUES (%L, ((select path from %1$I where id = %4$L) || %4$L), now(),now())
          RETURNING id;`, keys, vals, input.parentId);
        } 
      else {
        query = format(`
          INSERT INTO client (%I, created, updated)
          VALUES (%L, now(),now())
          RETURNING id;`, keys, vals);
      }
      console.log(`${query} `);

      //let client: genSprElm = {id: 0};
      try {
        const dbClient: PoolClient = await pool.connect();
        const res = await dbClient.query(query);
        dbClient.release();
        const elm = res.rows[0];
        return {elm: elm}
      } catch (err: any) {
        return { message: err.message };
        throw new Error(err.message);
      } 

      })
    })