import { ICity } from "./City"
export type IBank = {
	id: number,
    bik: string,
	oldCode?: number,
    name: string,
    corAccount: string,
    city: ICity,     
	alias?: string,
	created?: Date,
	updated?: Date,
	deleted?: Date
}


const createTable: string = `CREATE TABLE IF NOT EXISTS bank (
	id SERIAL PRIMARY KEY,
	bik VARCHAR(9) UNIQUE NOT NULL,
	old_code INTEGER,
	name VARCHAR ( 50 ) NOT NULL,
	indoc VARCHAR ( 150 ) NOT NULL,
    corAccount VARCHAR ( 20 ),
    city INTEGER REFERENCES city,
	alias VARCHAR (15),
	created TIMESTAMP NOT NULL,
	updated TIMESTAMP NOT NULL,
	deleted TIMESTAMP
    );`