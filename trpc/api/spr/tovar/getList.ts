import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { IClient, IClientCatalog } from '@/db/Entitys/Client'

const requestShema = z.object({
  tName: z.string(),
  tData: z.string().array().nonempty(),
  id: z.number()
})

export const clientSprGetList = router({
  getList: publicProcedure
    .input(requestShema)
    .query(async (opts) => {
      const { input } = opts;

      let all:boolean;
      let fieldList:string[]=[];
      if (input.tData[0] == 'all') {
        all =true;
      } else {
        all = false;
        //const module = await import(`./tValidate/${input.tName}.ts`);
        //fieldList = module.sprElmShema.keyof().parse(input.tData);
      }

      const { pool } = opts.ctx as Context;
      let clientList: IClient[] =[{id:0}];
      let query:string;

        query = format(`
          SELECT ${all ? '*': 'id, path, type, %1$I'} 
          FROM %2$I 
          ${ input.id==0 ? 'WHERE path is null': 'WHERE subpath(path, -1) = %$3L'}
          ORDER BY name;`, input.tData, input.tName, input.id);
          console.log(query)
      try {
        const dbClient = await pool.connect();
        const res = await dbClient.query(query);
        dbClient.release();
        clientList = res.rows;
        return {list: clientList, tc: pool.totalCount, ic: pool.idleCount}
      } catch(err) {
        console.log("Error", err);
      }
      
    })
})