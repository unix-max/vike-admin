import { IBank } from "./Bank"
import { IAccountType } from "./AccountType"
import { ICurrency } from "./Currency"
export interface IClientAccount {
    id?: number,
    oldCode?: number,
    clientId: number,
    type: IAccountType,
    name?: string,
    number: string,
    bank: IBank,
    currency: ICurrency,
	alias?: string,
    main: boolean,
    created: Date,
	updated: Date,
	deleted?: Date

}

const createTable: string = `CREATE TABLE IF NOT EXISTS client_account (
	id serial PRIMARY KEY,
    old_code INTEGER,
    client INTEGER REFERENCES client ON DELETE CASCADE,
	type INTEGER REFERENCES account_type ON DELETE RESTRICT,
	name VARCHAR ( 50 ) NOT NULL,
	number VARCHAR ( 20 ),
    bank INTEGER REFERENCES bank ON DELETE RESTRICT,
    currency INTEGER REFERENCES currency ON DELETE RESTRICT,
    description VARCHAR ( 120 ),
	alias VARCHAR (15),
	created TIMESTAMP NOT NULL,
	updated TIMESTAMP NOT NULL,
	deleted TIMESTAMP
    );`