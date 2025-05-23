import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import { z } from 'zod';
import format from 'pg-format'
import { IClient, IClientCatalog } from '@/db/Entitys/spr/Client'
import {list2tree} from '@/helpers/list2tree'

const requestShema = z.object({
  tName: z.string()
})

export const clientSprGetTree = router({
  getTree: publicProcedure
    .input(requestShema)
    .query(async (opts) => {
    const { pool } = opts.ctx as Context;
    const { input } = opts;

    let query:string = format(`
      SELECT id, path, type, name, COALESCE(nlevel(path),0) as level, subpath(path, -1) as parentId
      FROM %I
      WHERE type = 'F'
      ORDER BY level, name;`, input.tName);   
          console.log(query)
    try {
      const dbClient: PoolClient = await pool.connect();
      const res = await dbClient.query(query);
      dbClient.release();
      const  tree = {name: input.tName, in: list2tree(res.rows)}
      return tree;
    } catch(err) {
      console.log("Error", err);
    } 
    
  })
})