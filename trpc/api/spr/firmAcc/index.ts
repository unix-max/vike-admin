import { mergeRouters } from "@/trpc/server";
import { firmAccSprGetList } from "./getList";
import { firmAccSprGetElm } from "./getElm";

export const sprFirmAccRouter = mergeRouters(

  firmAccSprGetList, firmAccSprGetElm
);