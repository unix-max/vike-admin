import { IHuman } from "./Human"
import { IPost } from "./Post"
export interface IFirmEmployee {
//	[key: string]: any,
    id?: number,
	oldCode?: number,
	firmId: number,
	path?: string,
	level?: number,
    parent?: IFirmEmployee,
	parentId?: number,       
    human: IHuman,
	post?: IPost,
	email?: string,
	created: Date,
	updated: Date,
	deleted?: Date,

	in?: [IFirmEmployee]

}
export interface IFirmEmployeeCatalog {
    [key: string]: IFirmEmployee
}
const createTable: string = `CREATE TABLE IF NOT EXISTS firm_employee (
	id serial PRIMARY KEY,
	old_code INTEGER,
	firm INTEGER REFERENCES firm ON DELETE CASCADE,
	path ltree /*NOT NULL */,
    human INTEGER REFERENCES human ON DELETE RESTRICT,
	post INTEGER REFERENCES post ON DELETE RESTRICT,
	email VARCHAR (100),
	created TIMESTAMP NOT NULL,
	updated TIMESTAMP NOT NULL,
	deleted TIMESTAMP

    );`
