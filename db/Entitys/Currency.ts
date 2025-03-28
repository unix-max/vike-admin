
export type ICurrency = {
    id: number,
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

const createTable1: string = `CREATE TABLE IF NOT EXISTS currency_rate (
    id serial PRIMARY KEY,
    begin TIMESTAMPFTZ,
    currency_id INTEGER REFERENCES currency ON DELETE CASCADE,
    rate NUMERIC(10, 2) NOT NULL
    );`

const add: string = `
  INSERT INTO currency (code, sokr, symbol, name, alias, created, updated)
  VALUES (643, 'Руб', '₽', 'Российский рубль', 'RUB', NOW(), NOW());
  `;

  const addRate: string = `
    INSERT INTO currency_rate (begin, currency, rate)
		VALUES 
      ('2000-01-01 00:00:00 +3:00', 1, 1),
      ('2025-03-25 00:00:00 +3:00', 3, 84.62),
      ('2025-03-26 00:00:00 +3:00', 3, 84.08),
      ('2025-03-27 00:00:00 +3:00', 3, 84.50),
      ('2025-03-28 00:00:00 +3:00', 3, 84.50);
    `;