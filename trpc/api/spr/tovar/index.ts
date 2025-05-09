import { mergeRouters } from "@/trpc/server";
import { tovarSprLoadTable } from "./loadTable";
import { tovarSprGetTree } from "./getTree";
import { tovarSprGetList } from "./getList";
import { tovarSprGetElm } from "./getElm";
import { tovarSprSetElm } from "./setElm";

export const sprTovarRouter = mergeRouters(
  tovarSprLoadTable,
  tovarSprGetTree,
  tovarSprGetList,
  tovarSprGetElm,
  tovarSprSetElm
);