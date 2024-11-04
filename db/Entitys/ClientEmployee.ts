import { IHuman } from "./Human"
import { IPost } from "./Post"
import { IClientEmployeePhone } from "./ClientEmployeePhone"
export interface IClientEmployee {
	//[key: string]: any,
    id?: number,
	oldCode?: number,
	clientId: number,
	human: IHuman,
    post?: IPost,
	phone?: [IClientEmployeePhone],
	email?: string,
	contact: boolean,
	created: Date,
	updated: Date,
	deleted?: Date

}
const createTable: string = `CREATE TABLE IF NOT EXISTS client_employee (
	id serial PRIMARY KEY,
	old_code INTEGER,
	client INTEGER REFERENCES client ON DELETE CASCADE,
	human INTEGER REFERENCES human ON DELETE CASCADE,
	post INTEGER REFERENCES post,
	email VARCHAR (100),
	contact boolean,
	created TIMESTAMP NOT NULL,
	updated TIMESTAMP NOT NULL,
	deleted TIMESTAMP
	
    );`
