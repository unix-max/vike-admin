import { tovarSprLoadTable } from "./loadTable";
import { tovarSprGetTree } from "./getTree";
import { tovarSprGetList } from "./getList";
import { mergeRouters } from "@/trpc/server";

export const sprTovarRouter = mergeRouters(
  tovarSprLoadTable,
  tovarSprGetTree,
  tovarSprGetList
);