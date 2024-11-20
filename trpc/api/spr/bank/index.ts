import { mergeRouters } from "@/trpc/server";
import { bankSprGetList } from "./getList";


export const sprBankRouter = mergeRouters(

  bankSprGetList, 
);