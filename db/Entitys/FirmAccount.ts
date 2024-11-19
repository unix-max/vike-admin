import { IBank } from "./Bank"
import { IAccountType } from "./AccountType"
import { ICurrency } from "./Currency"
export type IFirmAccount = {
    id: number,
    oldCode?: number,
    firmId: number,
    type: IAccountType,
    name: string,
    number: string,
    bank: IBank,
    currency: ICurrency,
	alias?: string,
    main?: boolean,
    created?: Date,
	updated?: Date,
	deleted?: Date
}


const createTable: string = `CREATE TABLE IF NOT EXISTS firm_account (
	id serial PRIMARY KEY,
    old_code INTEGER,
    firm INTEGER REFERENCES firm ON DELETE CASCADE,
	type INTEGER REFERENCES account_type ON DELETE RESTRICT,
	name VARCHAR ( 50 ) NOT NULL,
	number VARCHAR ( 20 ),
    bank VARCHAR(9) REFERENCES bank ON DELETE RESTRICT,
    currency INTEGER REFERENCES currency ON DELETE RESTRICT,
	alias VARCHAR (15),
    main boolean,
	created TIMESTAMP NOT NULL,
	updated TIMESTAMP NOT NULL,
	deleted TIMESTAMP
    );`