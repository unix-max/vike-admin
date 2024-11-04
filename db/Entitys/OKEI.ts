export interface IOKEI {
    code: number,
    sokr: string,
    name: string,
	alias?: string,
	created: Date,
	updated: Date,
	deleted?: Date
}

const createTable: string = `CREATE TABLE IF NOT EXISTS okei (
	code INTEGER PRIMARY KEY,
	sokr VARCHAR (3) NOT NULL,
	name VARCHAR ( 30 ) NOT NULL,
	alias VARCHAR (15),
	created TIMESTAMP NOT NULL,
	updated TIMESTAMP NOT NULL,
	deleted TIMESTAMP
    );`
