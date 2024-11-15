export interface ISklad {
  [key: string]: any,
  id: number,
  oldCode?: number,
  name?: string,
  mol?: number,
alias?: string,
  created?: Date,
updated?: Date,
deleted?: Date,
}

const createTable: string = `CREATE TABLE IF NOT EXISTS sklad (
  id SERIAL PRIMARY KEY,
  old_code INTEGER,
name VARCHAR ( 70 ) NOT NULL,
mol INTEGER REFERENCES firm_employee,
alias VARCHAR (15),
created TIMESTAMP NOT NULL,
updated TIMESTAMP NOT NULL,
deleted TIMESTAMP
  );`
