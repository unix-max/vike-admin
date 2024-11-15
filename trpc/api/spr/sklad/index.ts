import { mergeRouters } from "@/trpc/server";
import { skladSprGetList } from "./getList";

export const sprSkladRouter = mergeRouters(

  skladSprGetList
);