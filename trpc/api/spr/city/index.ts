import { mergeRouters } from "@/trpc/server";
import { citySprGetList } from "./getList";
import { citySprGetElm } from "./getElm";

export const sprCityRouter = mergeRouters(

  citySprGetList, citySprGetElm
);