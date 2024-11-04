import { clientSprGetTree } from "./getTree";
import { clientSprGetList } from "./getList";
import { clientSprGetElm } from "./getElm";
import { clientSprLoadTable } from "./loadTable";
import { clientSprInsertElm } from "./insertElm";
import { mergeRouters } from "@/trpc/server";

export const sprClientRouter = mergeRouters(
  clientSprGetTree, 
  clientSprGetList,
  clientSprGetElm,
  clientSprInsertElm,
  clientSprLoadTable
);