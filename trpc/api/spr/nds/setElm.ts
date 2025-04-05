import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format, { string } from 'pg-format'
import { number, z } from 'zod';
import { INDS } from "@/db/Entitys/Nds";

const requestShema = z.object({
  id:         z.number(),
  name:       z.string(),
  val:    z.coerce.string(),
  alias:      z.string()
}).partial()

type inputSprElmType =  z.infer<typeof requestShema> & {[key: string]: any}

export const ndsSprSetElm = router({
  setElm: publicProcedure
    .input(requestShema)
    .mutation(async (opts) => {
      const { pool } = opts.ctx as Context;
      const  input = opts.input as inputSprElmType;

      const {id, ...qData } = input;
      const keys: string[] = Object.keys(qData);
      let vals: (string| number)[] = [];
      keys.forEach((val) => vals.push(qData[val]));

      let query:string;
      if (input.id && input.id > 0 ) {
        query = format(`
          UPDATE nds SET (%I, updated) = (%L, now())
          WHERE id = %L RETURNING id;`, keys, vals, input.id);   
        }
      else {
        query = format(`
          INSERT INTO nds (%I, created, updated)
          VALUES (%L, now(),now())
          RETURNING id;`, keys, vals);
      }
      console.log(`${query} `);

      try {
        const dbClient: PoolClient = await pool.connect();
        const res = await dbClient.query(query);
        dbClient.release();
        const elm = res.rows[0] as INDS;
        return {elm: elm}
      } catch (err: any) {
        return { message: err.message };
        //throw new Error(err.message);
      } 

      })
    })