import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format, { string } from 'pg-format'
import { number, z } from 'zod';
import { IFirm } from "@/db/Entitys/Firm";

const requestShema =z.object({
  id:         z.number(),
  oldCode:    z.number(),
  name:       z.string(),
	indoc:      z.string(),
	inn:        z.string(),
	kpp:        z.string(),
	ogrn:       z.string(),
  tax_sys:    z.enum(['osno', 'usn', 'ausn', 'psn', 'npd', 'eshn']),
	address:    z.string(),
	urAddress:  z.string(),
	phone:      z.string(),
	email:      z.string(),
	www:        z.string(),

})
.partial()

type inputSprElmType =  z.infer<typeof requestShema> & {[key: string]: any}

export const firmSprSetElm = router({
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
          UPDATE firm SET (%I, updated) = (%L, now())
          WHERE id = %L RETURNING id;`, keys, vals, input.id);   
        }
      else {
        query = format(`
          INSERT INTO firm (%I, created, updated)
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