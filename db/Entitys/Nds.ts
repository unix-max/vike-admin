export interface INDS {
    id: number,
    oldCode?: number,
    name: string,
    val: number,
	alias?: string,
    created: Date,
	updated: Date,
	deleted?: Date,
}

const createTable: string = `CREATE TABLE IF NOT EXISTS nds (
    id SERIAL PRIMARY KEY,
    old_code INTEGER,
	name VARCHAR ( 70 ) NOT NULL,
	alias VARCHAR (15),
	created TIMESTAMP NOT NULL,
	updated TIMESTAMP NOT NULL,
	deleted TIMESTAMP
    );`

const createTable1: string = `CREATE TABLE IF NOT EXISTS nds_val  (
    begin TIMESTAMP PRIMARY KEY,
    nds INTEGER REFERENCES nds ON DELETE CASCADE,
    val NUMERIC(5, 2) NOT NULL
    );`