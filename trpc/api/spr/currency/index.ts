import { mergeRouters } from "@/trpc/server";
import { currencySprGetList } from "./getList";
import { currencySprGetElm } from "./getElm";
import { currencySprSetElm } from "./setElm";
import { currencySprGetRateList } from "./getRateList";
import { currencySprGetRateElm } from "./getRateElm";
import { currencySprSetRateElm } from "./setRateElm";

export const sprCurrencyRouter = mergeRouters(
  currencySprGetList,
  currencySprGetElm,
  currencySprSetElm,
  currencySprGetRateList,
  currencySprGetRateElm,
  currencySprSetRateElm
);