import { mergeRouters } from "@/trpc/server";
import { accTypeSprGetList } from "./getList";
import { ndsSprGetElm } from "./getElm";
import { ndsSprSetElm } from "./setElm";

export const sprAccTypeRouter = mergeRouters(
  accTypeSprGetList,
  ndsSprGetElm,
  ndsSprSetElm,
);