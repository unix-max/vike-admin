import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import { z } from 'zod';
import { IClient, IClientCatalog } from '@/db/Entitys/Client'

const listQuery = `
    SELECT 
      c.id
    , c.path
    , c.type
    , c.name
    , c.phone
    FROM client AS c
    WHERE subpath(path, -1) = $1
    ORDER BY name;
`;
const listQuery1 = `
    SELECT 
      c.id
    , c.path
    , c.type
    , c.name
    , c.phone
    FROM client AS c
    WHERE path is null
    ORDER BY name;
`;

export const clientSprGetList = router({
  getList: publicProcedure
    .input(z.number())
    .query(async (opts) => {
      const { pool } = opts.ctx as Context;
      const id = opts.input
      let clientList: IClient[] =[{id:0}];
      try {
        const dbClient = await pool.connect();
        let res;
        if (id == 0) {
          res = await dbClient.query(listQuery1);
        } else {
          res = await dbClient.query(listQuery, [String(id)]);
        }
        await dbClient.release();
        clientList = res.rows;
        return {list: clientList, tc: pool.totalCount, ic: pool.idleCount}
      } catch(err) {
        console.log("Error", err);
      }
      
    })
})