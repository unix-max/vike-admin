import { mergeRouters } from "@/trpc/server";
import { currencySprGetList } from "./getList";
import { currencySprGetElm } from "./getElm";
import { currencySprSetElm } from "./setElm";
import { currencySprGetRateList } from "./getRateList";

export const sprCurrencyRouter = mergeRouters(

  currencySprGetList, currencySprGetElm, currencySprSetElm, currencySprGetRateList
);