export type INDS = {
  id: number;
  oldCode?: number;
  name: string;
  val: number;
	alias?: string;
  created?: Date;
	updated?: Date;
	deleted?: Date;
}

const createTable: string = `
  CREATE TABLE IF NOT EXISTS nds (
    id SERIAL PRIMARY KEY,
    old_code INTEGER,
		name VARCHAR ( 70 ) NOT NULL,
		val NUMERIC(5, 2) NOT NULL,
		alias VARCHAR (15),
		created TIMESTAMPTZ NOT NULL,
		updated TIMESTAMPTZ NOT NULL,
		deleted TIMESTAMPTZ
	);
`;

const add: string = `
  INSERT INTO nds (name, val, created, updated)
  	VALUES ("Без НДС", 0, NOW(), NOW()),
		("НДС 0%", 0, NOW(), NOW()),
		("НДС 5%", 5, NOW(), NOW()),
		 ("НДС 10%", 10, NOW(), NOW()),
		 ("НДС 20%", 20, NOW(), NOW())
	;
  `;
