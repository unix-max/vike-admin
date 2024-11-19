
export interface ICurrency {
    code: number,
    oldCode?: number,
    sokr: string,
    symbol: string,
    name: string,
	alias?: string,
    created?: Date,
	updated?: Date,
	deleted?: Date
}


const createTable: string = `CREATE TABLE IF NOT EXISTS currency (
    id serial PRIMARY KEY,
	code INTEGER UNIQUE NOT NULL,
    old_code INTEGER,
	sokr VARCHAR (3) NOT NULL,
    symbol VARCHAR (3) NOT NULL,
	name VARCHAR ( 70 ) NOT NULL,
	alias VARCHAR (15),
	created TIMESTAMP NOT NULL,
	updated TIMESTAMP NOT NULL,
	deleted TIMESTAMP
    );`

const createTable1: string = `CREATE TABLE IF NOT EXISTS rate (
    begin TIMESTAMP PRIMARY KEY,
    currency INTEGER REFERENCES currency ON DELETE CASCADE,
    rate NUMERIC(10, 2) NOT NULL
    );`

const add: string = `
  INSERT INTO currency (code, sokr, symbol, name, alias, created, updated)
  VALUES (643, 'Руб', '₽', 'Российский рубль', 'RUB', NOW(), NOW());
  `;