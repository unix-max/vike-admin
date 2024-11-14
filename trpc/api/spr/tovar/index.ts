
import { tovarSprLoadTable } from "./loadTable";

import { mergeRouters } from "@/trpc/server";

export const sprTovarRouter = mergeRouters(

  tovarSprLoadTable
);