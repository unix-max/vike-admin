export interface IPhoneType {
    id: number,
    oldCode?: number,
    name: string,
    icon?: number,
	alias?: string,
    created: Date,
	updated: Date,
	deleted?: Date

}

const createTable: string = `CREATE TABLE IF NOT EXISTS phone_type (
    id SERIAL PRIMARY KEY,
    old_code INTEGER,
	name VARCHAR ( 70 ) NOT NULL,
    icon INTEGER,
	alias VARCHAR (15),
	created TIMESTAMP NOT NULL,
	updated TIMESTAMP NOT NULL,
	deleted TIMESTAMP
    );`
