import { mergeRouters } from "@/trpc/server";
import { schetDocGetList } from "./getList";

export const docSchetRouter = mergeRouters(
  schetDocGetList

);