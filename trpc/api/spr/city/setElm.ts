import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format, { string } from 'pg-format'
import { number, z } from 'zod';

const requestShema = z.object({
  id:         z.number(),
  code:       z.coerce.string(),
	oldCode:    z.number(),
  name:       z.string(),
  full_name:   z.string(),
  a2:         z.string().length(2),
  a3:         z.string().length(3),
  alias:      z.string()
}).partial()

type genSprElm = {
  [key: string]: any,
  id?: number,
}
export const citySprSetElm = router({
  setElm: publicProcedure
    .input(requestShema)
    .mutation(async (opts) => {
      const { pool } = opts.ctx as Context;
      const { input } = opts as genSprElm;

      const {id, ...qData } = input;
      const keys: string[] = Object.keys(qData);
      let vals: (string| number)[] = [];
      keys.forEach((val) => vals.push(qData[val]));

      let query:string;
      if (input.id && input.id > 0 ) {
        query = format(`
          UPDATE oksm SET (%I, updated) = (%L, now())
          WHERE id = %L RETURNING id;`, keys, vals, input.id);   
        }
      else {
        query = format(`
          INSERT INTO oksm (%I, created, updated)
          VALUES (%L, now(),now())
          RETURNING id;`, keys, vals);
      }
      console.log(`${query} `);

      try {
        const dbClient = await pool.connect();
        const res = await dbClient.query(query);
        dbClient.release();
        const elm = res.rows[0];
        return {elm: elm}
      } catch (err: any) {
        return { message: err.message };
        //throw new Error(err.message);
      } 

      })
    })