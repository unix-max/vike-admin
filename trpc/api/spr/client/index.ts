import { clientSprGetTree } from "./getTree";
import { clientSprGetList } from "./getList";
import { clientSprGetElm } from "./getElm";
import { clientSprLoadTable } from "./loadTable";
import { clientSprInsertElm } from "./insertElm";
import { clientAccSprGetList } from "./getAccList";
import { clientAccSprGetElm } from "./getAccElm";
import { clientAccSprSetElm } from "./setAccElm";
import { mergeRouters } from "@/trpc/server";

export const sprClientRouter = mergeRouters(
  clientSprGetTree, 
  clientSprGetList,
  clientSprGetElm,
  clientSprInsertElm,
  clientSprLoadTable,
  clientAccSprGetList,
  clientAccSprGetElm,
  clientAccSprSetElm,
);