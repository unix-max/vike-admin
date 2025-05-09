export interface IClientEmployeePhone {
    id: number,
    old_code?: number,
    type: number,
    name: string,
    phone: string,
    alias?: string,
    main: boolean,	
    created: Date,
	updated: Date,
	deleted?: Date
}

const createTable: string = `CREATE TABLE IF NOT EXISTS client_employee_phone (
    id SERIAL PRIMARY KEY,
    old_code INTEGER,
    client_employee INTEGER REFERENCES client_employee ON DELETE CASCADE,
    type INTEGER REFERENCES phone_type,
	name VARCHAR ( 25 ) NOT NULL,
    phone varchar (15),
	alias VARCHAR (50),
    main boolean,
	created TIMESTAMP NOT NULL,
	updated TIMESTAMP NOT NULL,
	deleted TIMESTAMP
    );`