import { ICity } from "./City"
export interface IBank {
    bik: string,
	oldCode?: number,
    name?: string,
    corAccount: string,
    city?: ICity,     
	alias?: string,
	created: Date,
	updated: Date,
	deleted?: Date
}


const createTable: string = `CREATE TABLE IF NOT EXISTS bank (
	bik VARCHAR(9) PRIMARY KEY,
	old_code INTEGER,
	name VARCHAR ( 50 ) NOT NULL,
    corAccount VARCHAR ( 20 ),
    city INTEGER REFERENCES city (id) ON DELETE RESTRICT,
	alias VARCHAR (15),
	created TIMESTAMP NOT NULL,
	updated TIMESTAMP NOT NULL,
	deleted TIMESTAMP
    );`