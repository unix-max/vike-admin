import { mergeRouters } from "@/trpc/server";
import { accTypeSprGetList } from "./getList";
import { accTypeSprGetElm } from "./getElm";
import { accTypeSprSetElm } from "./setElm";

export const sprAccTypeRouter = mergeRouters(
  accTypeSprGetList,
  accTypeSprGetElm,
  accTypeSprSetElm,
);