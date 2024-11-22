import { mergeRouters } from "@/trpc/server";
import { skladSprGetList } from "./getList";
import { skladSprGetElm } from "./getElm";
import { skladSprSetElm } from "./setElm";

export const sprSkladRouter = mergeRouters(

  skladSprGetList, skladSprGetElm, skladSprSetElm
);