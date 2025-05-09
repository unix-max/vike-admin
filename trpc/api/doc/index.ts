import { router } from "../../server";
import { docSchetRouter } from "./schet";

export const docRouter = router({
  schet: 	docSchetRouter

});