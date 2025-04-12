import { mergeRouters } from "@/trpc/server";
import { ndsSprGetList } from "./getList";
import { ndsSprGetElm } from "./getElm";
import { ndsSprSetElm } from "./setElm";

export const sprNdsRouter = mergeRouters(
  ndsSprGetList,
  ndsSprGetElm,
  ndsSprSetElm,
);