import { router } from "../../server";
import { sprClientRouter } from "./client";
import { sprTovarRouter } from "./tovar";
import { sprSkladRouter } from "./sklad";
import { sprFirmRouter } from "./firm";
import { sprFirmAccRouter } from "./firmAcc";

export const sprRouter = router({
  client: sprClientRouter,
  tovar: sprTovarRouter,
  sklad: sprSkladRouter,
  firm: sprFirmRouter,
  firmAcc: sprFirmAccRouter
})