import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import { z } from 'zod';
import { IClient, IClientCatalog } from '@/db/Entitys/Client'
import {list2tree} from '@/helpers/list2tree'

const treeQuery = `
    SELECT 
      c.id
    , c.path
    , c.type
    , c.name
    , COALESCE(nlevel(path),0) as level
    , subpath(path, -1) as parentId
    FROM client AS c
    WHERE c.type = 'F'
    ORDER BY level, name;
`;

export const clientSprGetTree = router({
  getTree: publicProcedure.query(async (opts) => {
    const { pool } = opts.ctx as Context;
    try {
      const dbClient = await pool.connect();
      const res = await dbClient.query(treeQuery);
      await dbClient.release();
      const  tree = {name: 'Клиенты', in: list2tree<IClient>(res.rows)}
      return tree;
    } catch(err) {
      console.log("Error", err);
    } 
    
  })
})