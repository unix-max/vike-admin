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

const createTable: string = `CREATE TABLE IF NOT EXISTS firm (
	id serial PRIMARY KEY,
	old_code INTEGER,
	type VARCHAR (10),
	name VARCHAR ( 200 ),
	inDoc VARCHAR (200),
	inn VARCHAR (12),
	kpp VARCHAR (9),
	ogrn VARCHAR (13),
	address VARCHAR (150),
	urAddress VARCHAR (150),
	addr jsonb not null default '{}'::jsonb,
	ur_addr jsonb not null default '{}'::jsonb,
	phone INTEGER,
	email VARCHAR (100),
	nds BOOLEAN NOT NULL,

	www VARCHAR (100),
	created TIMESTAMP NOT NULL,
	updated TIMESTAMP NOT NULL,
	deleted TIMESTAMP
    );`

