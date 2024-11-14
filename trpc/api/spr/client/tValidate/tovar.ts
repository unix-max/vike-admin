import { z } from 'zod';

export const sprElmShema = z.object({
  id:         z.number(),
  oldCode:    z.number(),
	path:       z.string(),
	type:       z.string(),
  name:       z.string(),
	parentId:   z.number(),
	nomer:      z.number(),
	okei:				z.number(),
	oksm:				z.number(),
	minost:			z.number(),
	currencyAccounting: z.number(),
	currencySale: z.number(),
	//nds:        z.number(),
	//np:         z.number(),

})
.partial()