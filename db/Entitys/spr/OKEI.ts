export type IOKEI = {
	id: number,
  code: number,  
  name: string,
	sokr_rus?: string,
	sokr_int?: string,
	alias?: string,
	created?: Date,
	updated?: Date,
	deleted?: Date
}

const createTable: string = `CREATE TABLE IF NOT EXISTS okei (
	id serial PRIMARY KEY,
	code INTEGER UNIQUE NOT NULL,
	name VARCHAR ( 30 ) NOT NULL,
	sokr_rus VARCHAR (15) NOT NULL,
	sokr_int VARCHAR (15) NOT NULL,
	alias VARCHAR (15),
	created TIMESTAMPTZ NOT NULL,
	updated TIMESTAMPTZ NOT NULL,
	deleted TIMESTAMPTZ
    );`

		const add: string = `
			INSERT INTO okei (code, name, sokr_rus, sokr_int, created, updated)
			VALUES (796, 'Штука', 'шт', 'pcs', NOW(), NOW());
		`;