	
enum tax_sys { osno, usn, ausn, psn, npd, eshn };
export interface IFirm {
	[key: string]: any,
    id: number,
	oldCode?: number,
	type?: string,
    name?: string,
	indoc?: string,
	inn?: string,
	kpp?: string,
	ogrn?: string,
	tax_sys?: tax_sys,
	address?: string,
	urAddress?: string,
	phone?: string,
	email?: string,
	www?: string,
	nds?: boolean,
	
	created?: Date,
	updated?: Date,
	deleted?: Date,


}
const createTaxSysType: string = `CREATE TYPE tax_sys AS ENUM ('osno', 'usn', 'ausn', 'psn', 'npd', 'eshn');`;

const createTable: string = `CREATE TABLE IF NOT EXISTS firm (
	id serial PRIMARY KEY,
	old_code INTEGER,
	name VARCHAR ( 200 ),
	inDoc VARCHAR (200),
	inn VARCHAR (12),
	kpp VARCHAR (9),
	ogrn VARCHAR (13),
	tax_sys tax_sys,
	address VARCHAR (150),
	urAddress VARCHAR (150),
	addr jsonb not null default '{}'::jsonb,
	ur_addr jsonb not null default '{}'::jsonb,
	phone INTEGER,
	email VARCHAR (100),
	sklad INTEGER REFERENCES sklad,
	www VARCHAR (100),
	created TIMESTAMPTZ NOT NULL,
	updated TIMESTAMPTZ NOT NULL,
	deleted TIMESTAMPTZ
  );`

