import { IOKSM } from "./OKSM"
export type ICity = {
    id: number,
	oldKod?: number,
    name: string,
	fullName?: string,
	oksm: IOKSM, 
	alias?: string,
	created?: Date,
	updated?: Date,
	deleted?: Date
}


const createTable: string = `CREATE TABLE IF NOT EXISTS city (
	id serial PRIMARY KEY,
	old_code INTEGER,
	name VARCHAR ( 50 ) NOT NULL,
	full_name VARCHAR ( 100 ),
	oksm INTEGER REFERENCES oksm,
	alias VARCHAR (15),
	created TIMESTAMP NOT NULL,
	updated TIMESTAMP NOT NULL,
	deleted TIMESTAMP
    );`

		const add=`
		insert into city (name, fullname, oksm, alias, created, updated)
		values ('Н.Новгород', 'Нижний Новгород', 643, 'NiNo', NOW(), NOW());
		`