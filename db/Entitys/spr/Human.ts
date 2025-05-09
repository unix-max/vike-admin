import { IDocType } from "./DocType"
export interface IHuman {
	[key: string]: any,
    id?: number,
	oldKod?: number,
	path?: string,
	level?: number,
    parent?: IHuman,
	parentId?: number,
	nic?: string,
    firstName?: string,
    lastName?: string,
    surName?: string,
    birthday?: Date,
	    	
	inn?: string,
	address?: string,
	phone?: string,
	email?: string,

	created: Date,
	updated: Date,
	deleted?: Date,
	in?: [IHuman]

}
export interface IClientCatalog {
    [key: string]: IHuman
}
const createTable: string = `CREATE TABLE IF NOT EXISTS human (
	id serial PRIMARY KEY,
	oldKod INTEGER,
	path ltree /*NOT NULL */,
	nic VARCHAR ( 100 ),
    first_name VARCHAR (100),
    last_name VARCHAR (100),
    sur_name VARCHAR (100),
    birthday DATE,
	inn VARCHAR (12),
	address VARCHAR (150),
	addr jsonb not null default '{}'::jsonb,
	email VARCHAR (100),
	created TIMESTAMP NOT NULL,
	updated TIMESTAMP NOT NULL,
	deleted TIMESTAMP
	-- parent  INTEGER REFERENCES tovar (id) ON DELETE CASCADE,

    );`

	const index = `
	CREATE INDEX human_path_idx ON human USING BTREE (path);
	CREATE INDEX human_path_gist_idx ON human USING GIST (path);
`
const createTable1: string = `CREATE TABLE IF NOT EXISTS human_doc  (
    id serial PRIMARY KEY,
	human INTEGER REFERENCES human ON DELETE CASCADE,
    doc_type INTEGER REFERENCES doc_type ON DELETE RESTRICT,
    doc jsonb not null default '{}'::jsonb
    );`
