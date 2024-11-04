import { appRouter } from "../trpc/appRouter";
import { pool } from "../db/pool";
import type { Pool } from "pg";
// TODO: stop using universal-middleware and directly integrate server middlewares instead. (Bati generates boilerplates that use universal-middleware https://github.com/magne4000/universal-middleware to make Bati's internal logic easier. This is temporary and will be removed soon.)
import type { Get, UniversalHandler } from "@universal-middleware/core";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

export type Context = { pool:Pool, context: object, runtime: object, req: Request, resHeaders: Headers };

export const trpcHandler = ((endpoint) => (request, context, runtime) => {
  return fetchRequestHandler({
    endpoint,
    req: request,
    router: appRouter,
    createContext({ req, resHeaders }) {
      return {
        pool,
        ...context,
        ...runtime,
        req,
        resHeaders,
      };
    },
  });
}) satisfies Get<[endpoint: string], UniversalHandler>;
