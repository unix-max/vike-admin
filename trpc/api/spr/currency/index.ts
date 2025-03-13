import { mergeRouters } from "@/trpc/server";
import { currencySprGetList } from "./getList";
import { currencySprGetElm } from "./getElm";
import { currencySprSetElm } from "./setElm";

export const sprCurrencyRouter = mergeRouters(

  currencySprGetList, currencySprGetElm, currencySprSetElm
);