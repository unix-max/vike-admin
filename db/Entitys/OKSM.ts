export interface IOKSM {
    code?: number,
	oldCode?: number,
	name: string,
	fullName: string,
	a2: string,
	a3: string, 
	alias?: string,
	created: Date,
	updated: Date,
	deleted?: Date
}


const createTable: string = `CREATE TABLE IF NOT EXISTS oksm (
	code INTEGER PRIMARY KEY,
	old_code INTEGER,
	name VARCHAR ( 50 ) UNIQUE NOT NULL,
	full_name VARCHAR ( 150 ),
	a2 VARCHAR ( 2 ),
	a3 VARCHAR ( 3 ),
	alias VARCHAR (15),
	created TIMESTAMP NOT NULL,
	updated TIMESTAMP NOT NULL,
	deleted TIMESTAMP
    );`