import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';

const requestShema = z.object({
  tName: z.string(),
  tData: z.object({}).passthrough()
})

type genSprElm = {
  [key: string]: any,
  id?: number,
  parentId?: number
}
export const clientSprInsertElm = router({
  insertElm: publicProcedure
    .input(requestShema)
    .use(async (opts) => {
    
      return opts.next();
    })
    .mutation(async (opts) => {
      const { pool } = opts.ctx as Context;
      const { input } = opts as genSprElm;
      
      let elmData:genSprElm = {} 
      try {
        const module = await import(`./tValidate/${input.tName}.ts`);
        if (input.tData) {
          elmData = module.sprElmShema.parse(input.tData);
          
        } else throw new Error("Отсутствует имя таблицы");
      } catch (err: any) {
        console.log(err)
      }

      const {id, parentId, ...qData } = elmData;
      const keys: string[] = Object.keys(qData);
      let vals: (string| number)[] = [];
      keys.forEach((val) => vals.push(qData[val]));

      let query:string;
      console.log(elmData, keys, vals);
      if (elmData.id) {
        query = format(`
          UPDATE %I SET (%I, updated) = (%L, now())
          WHERE id = %L RETURNING id;`, input.tName, keys, vals, elmData.id);   
        }
      else if (elmData.parentId && elmData.parentId > 0) {
        query = format(`
          INSERT INTO %I (%I, path, created, updated)
          VALUES (%L, ((select path from %1$I where id = %4$L) || %4$L), now(),now())
          RETURNING id;`, input.tName, keys, vals, elmData.parentId);
        } 
      else {
        query = format(`
          INSERT INTO %I (%I, created, updated)
          VALUES (%L, now(),now())
          RETURNING id;`, input.tName, keys, vals);
      }
      console.log(`${query} `);

      let client: genSprElm = {id: 0};
      try {
        const dbClient = await pool.connect();
        const res = await dbClient.query(query);
        dbClient.release();
        client = res.rows[0];
        return {client: client}
      } catch (err: any) {
        return { message: err.message };
        throw new Error(err.message);
      } 

      })
    })