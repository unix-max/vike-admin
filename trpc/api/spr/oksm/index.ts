import { mergeRouters } from "@/trpc/server";
import { oksmSprGetList } from "./getList";
import { oksmSprGetElm } from "./getElm";

export const sprOksmRouter = mergeRouters(

  oksmSprGetList, oksmSprGetElm
);