import { z } from 'zod';

export const sprElmShema = z.object({
  id:         z.number(),
  oldCode:    z.number(),
	path:       z.string(),
	type:       z.string(),
  name:       z.string(),
	parentId:   z.number(),
	nomer:      z.number(),
	indoc:      z.string(),
	inn:        z.string(),
	kpp:        z.string(),
	ogrn:       z.string(),
	address:    z.string(),
	urAddress:  z.string(),
	phone:      z.string(),
	email:      z.string(),
	www:        z.string(),
	nds:        z.number(),
	np:         z.number(),

})
.partial()