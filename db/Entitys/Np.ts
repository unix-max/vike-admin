export interface INP {
    id: number,
    oldCode?: number,
    name: string,
    val: number,
	alias?: string,
    created: Date,
	updated: Date,
	deleted?: Date,
}

const createTable: string = `CREATE TABLE IF NOT EXISTS np (
    id SERIAL PRIMARY KEY,
    old_code INTEGER,
	name VARCHAR ( 70 ) NOT NULL,
	alias VARCHAR (15),
	created TIMESTAMP NOT NULL,
	updated TIMESTAMP NOT NULL,
	deleted TIMESTAMP
    );`

const createTable1: string = `CREATE TABLE IF NOT EXISTS np_val  (
    begin TIMESTAMP PRIMARY KEY,
    np INTEGER REFERENCES np ON DELETE CASCADE,
    val NUMERIC(5, 2) NOT NULL
    );`