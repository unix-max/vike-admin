import { router } from "./server";
import { publicProcedure } from "./server";
import type { Context } from "../server/trpc-handler";
import { z } from 'zod'; 
import { sprRouter } from "./api/spr";
import { docRouter } from "./api/doc";
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */

export const appRouter = router({
  spr: sprRouter,
  doc: docRouter,
  demo: publicProcedure
    .input(z.number())
    .query(async (opts) => {
    //console.log(opts)
    const { pool } = opts.ctx as Context;
    //console.log(pool);
    
    const dbClient = await pool.connect();
      const res = await pool.query('SELECT NOW()');
      dbClient.release()
      //console.log(res);
    
    return {now: res.rows[0].now, inp: opts.input};
  }),
  onNewTodo: publicProcedure
    .input((value): string => {
      if (typeof value === "string") {
        return value;
      }
      throw new Error("Input is not a string");
    })
    .mutation(async (opts) => {
      console.log("Received new todo", { text: opts.input });
    }),
});

export type AppRouter = typeof appRouter;
