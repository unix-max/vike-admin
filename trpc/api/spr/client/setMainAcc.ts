import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format, { string } from 'pg-format'
import { number, z } from 'zod';
import { IFirm } from "@/db/Entitys/Firm";

const requestShema =z.object({
  id:       z.coerce.number().positive(),
  main_id:  z.coerce.number().positive()
})

type inputSprElmType =  z.infer<typeof requestShema> & {[key: string]: any}

export const firmSprSetMainAcc = router({
  setMainAcc: publicProcedure
    .input(requestShema)
    .mutation(async (opts) => {
      const { pool } = opts.ctx as Context;
      const  input = opts.input as inputSprElmType;

      let query:string = format(`
        UPDATE firm SET (main_acc, updated) = (%L, now())
        WHERE id = %L RETURNING id;`, input.main_id, input.id);

      console.log(`${query} `);

      try {
        const dbClient: PoolClient = await pool.connect();
        const res = await dbClient.query(query);
        dbClient.release();
        const elm = res.rows[0] as number;
        return {elm: elm}
      } catch (err: any) {
        return { message: err.message };
        //throw new Error(err.message);
      } 

      })
    })