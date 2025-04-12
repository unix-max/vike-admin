export type IAccountType = {
    id: number,
	oldCode?: number,
    name: string, 
	descript?: string,
	alias?: string,
	created?: Date,
	updated?: Date,
	deleted?: Date
}


const createTable: string = `CREATE TABLE IF NOT EXISTS account_type (
	id serial PRIMARY KEY,
	old_code INTEGER,
	name VARCHAR ( 50 ) NOT NULL,
	descript VARCHAR ( 150 ),
	alias VARCHAR (15),
	created TIMESTAMPTZ NOT NULL,
	updated TIMESTAMPTZ NOT NULL,
	deleted TIMESTAMPTZ
  );`

		const add = `
		insert into account_type (name, descript, alias, created, updated)
values ('Рассчетный', 'Текущий счет',  'тек', NOW(), NOW());
		`