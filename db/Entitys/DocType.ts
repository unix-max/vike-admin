export interface IDocType {
    id: number,
	oldCode?: number,
    name: string,
	alias?: string,
	created: Date,
	updated: Date,
	deleted?: Date
}


const createTable: string = `CREATE TABLE IF NOT EXISTS doc_type (
    id SERIAL PRIMARY KEY,
	old_code INTEGER,
	name VARCHAR ( 50 ) NOT NULL,
	alias VARCHAR (15),
	created TIMESTAMP NOT NULL,
	updated TIMESTAMP NOT NULL,
	deleted TIMESTAMP
    );`