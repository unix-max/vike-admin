import { mergeRouters } from "@/trpc/server";
import { oksmSprGetList } from "./getList";
import { oksmSprGetElm } from "./getElm";
import { oksmSprSetElm } from "./setElm";

export const sprOksmRouter = mergeRouters(

  oksmSprGetList, oksmSprGetElm, oksmSprSetElm
);