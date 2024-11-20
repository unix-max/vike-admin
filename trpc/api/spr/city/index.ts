import { mergeRouters } from "@/trpc/server";
import { citySprGetList } from "./getList";
import { citySprGetElm } from "./getElm";
import { citySprSetElm } from "./setElm";

export const sprCityRouter = mergeRouters(

  citySprGetList, citySprGetElm, citySprSetElm
);