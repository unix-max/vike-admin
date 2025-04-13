import { router } from "../../server";
import { sprClientRouter } from "./client";
import { sprTovarRouter } from "./tovar";
import { sprSkladRouter } from "./sklad";
import { sprFirmRouter } from "./firm";

import { sprCityRouter } from "./city";
import { sprOksmRouter } from "./oksm";
import { sprBankRouter } from "./bank";
import { sprCurrencyRouter } from "./currency";
import { sprNdsRouter } from "./nds";
import { sprAccTypeRouter } from "./accType";

export const sprRouter = router({
  client: sprClientRouter,
  tovar: sprTovarRouter,
  sklad: sprSkladRouter,
  firm: sprFirmRouter,
  
  city: sprCityRouter,
  oksm: sprOksmRouter,
  bank: sprBankRouter,
  currency: sprCurrencyRouter,
  nds: sprNdsRouter,
  accType: sprAccTypeRouter
})