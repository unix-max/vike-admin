import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format, { string } from 'pg-format'
import { number, z } from 'zod';
import { IFirm } from "@/db/Entitys/Firm";

const requestShema =z.object({
  id:         z.coerce.number(),
  oldCode:    z.coerce.number(),
  firm_id:    z.coerce.number(),
  type:       z.coerce.number(),
  name:       z.string(),
  number:     z.string(),
	bank:       z.coerce.number(),
  currency:   z.coerce.number(),
  alias:      z.string(),
  main:       z.coerce.boolean()
})
.partial()

type inputSprElmType =  z.infer<typeof requestShema> & {[key: string]: any}

export const firmAccSprSetElm = router({
  setAccElm: publicProcedure
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
          UPDATE firm_account SET (%I, updated) = (%L, now())
          WHERE id = %L RETURNING id;`, keys, vals, input.id);   
        }
      else {
        query = format(`
          INSERT INTO firm_account (%I, created, updated)
          VALUES (%L, now(),now())
          RETURNING id;`, keys, vals);
      }
      console.log(`${query} `);

      try {
        const dbClient: PoolClient = await pool.connect();
        const res = await dbClient.query(query);
        dbClient.release();
        const elm = res.rows[0] as IFirm;
        return {elm: elm}
      } catch (err: any) {
        return { message: err.message };
        //throw new Error(err.message);
      } 

      })
    })