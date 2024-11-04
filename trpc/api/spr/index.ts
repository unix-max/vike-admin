import { router } from "../../server";
import { sprClientRouter } from "./client";

export const sprRouter = router({
  client: sprClientRouter
})