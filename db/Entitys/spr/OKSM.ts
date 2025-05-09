export type IOKSM = {
	id: number,
	code: number,
	oldCode?: number,
	name: string,
	fullName?: string,
	a2?: string,
	a3?: string, 
	alias?: string,
	created?: Date,
	updated?: Date,
	deleted?: Date
}


const createTable: string = `CREATE TABLE IF NOT EXISTS oksm (
	id SERIAL PRIMARY KEY,
	code INTEGER UNIQUE NOT NULL,
	old_code INTEGER,
	name VARCHAR ( 50 ) NOT NULL,
	full_name VARCHAR ( 150 ),
	a2 VARCHAR ( 2 ),
	a3 VARCHAR ( 3 ),
	alias VARCHAR (15),
	created TIMESTAMP NOT NULL,
	updated TIMESTAMP NOT NULL,
	deleted TIMESTAMP
    );
		`;

		const add: string = `
			INSERT INTO oksm (code, name, full_name, a2, a3, alias, created, updated)
			VALUES (643, 'РОССИЯ', 'Российская Федерация',	'RU', 'RUS', 'РФ', NOW(), NOW());
			`;