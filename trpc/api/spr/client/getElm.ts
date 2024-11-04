import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import { z } from 'zod';
import { IClient, IClientCatalog } from '@/db/Entitys/Client'

const query = `
    SELECT *
    FROM client AS c
    WHERE c.id = $1
    ;
`;

export const clientSprGetElm = router({
  getElm: publicProcedure
    .input(z.number())
    .query(async (opts) => {
      const { pool } = opts.ctx as Context;
      const id = opts.input
      try {
        const dbClient = await pool.connect();
        const res = await dbClient.query(query, [id]);
        await dbClient.release();
        let elm: IClient = res.rows[0];
        return { elm: elm }
      } catch(err) {
        console.log("Error", err);
      }
    })
})