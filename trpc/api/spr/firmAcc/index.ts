import { mergeRouters } from "@/trpc/server";
import { firmAccSprGetList } from "./getList";

export const sprFirmAccRouter = mergeRouters(

  firmAccSprGetList
);