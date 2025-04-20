import { mergeRouters } from "@/trpc/server";
import { okeiSprGetList } from "./getList";
import { okeiSprGetElm } from "./getElm";
import { okeiSprSetElm } from "./setElm";

export const sprOKEIRouter = mergeRouters(
  okeiSprGetList,
  okeiSprGetElm,
  okeiSprSetElm,
);