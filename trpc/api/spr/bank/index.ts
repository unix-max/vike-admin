import { mergeRouters } from "@/trpc/server";
import { bankSprGetList } from "./getList";
import { bankSprGetElm } from "./getElm";
import { bankSprSetElm } from "./setElm";

export const sprBankRouter = mergeRouters(

  bankSprGetList, bankSprGetElm, bankSprSetElm
);