import { mergeRouters } from "@/trpc/server";
import { schetGetJorn } from "./getJorn";
import { schetGetDoc } from "./getDoc";
export const docSchetRouter = mergeRouters(
  schetGetJorn,
  schetGetDoc

);