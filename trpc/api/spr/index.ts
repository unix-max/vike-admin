import { router } from "../../server";
import { sprClientRouter } from "./client";
import { sprTovarRouter } from "./tovar";

export const sprRouter = router({
  client: sprClientRouter,
  tovar: sprTovarRouter
})