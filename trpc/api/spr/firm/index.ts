import { mergeRouters } from "@/trpc/server";
import { firmSprGetList } from "./getList";
import { firmSprGetElm } from "./getElm";
import { firmSprSetElm } from "./setElm";
import { firmAccSprGetList } from "./getAccList";
import { firmAccSprGetElm } from "./getAccElm";
import { firmAccSprSetElm

 } from "./setAccElm";
export const sprFirmRouter = mergeRouters(
  firmSprGetList,
  firmSprGetElm,
  firmSprSetElm,
  firmAccSprGetList,
  firmAccSprGetElm,
  firmAccSprSetElm
);