import { mergeRouters } from "@/trpc/server";
import { firmSprGetList } from "./getList";
import { firmSprGetElm } from "./getElm";

export const sprFirmRouter = mergeRouters(
  firmSprGetList,
  firmSprGetElm
);