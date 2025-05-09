export interface ITovar {
	[key: string]: any,
    id: number,
	path?: string,
	oldCode?: number,
	type?: string,
	level?: number,
    parent?: ITovar,
	parentId?: number,  
    name?: string,       
	okei?: number,
	oksm?: number,
	minost?: number,
	currencyAccounting?: number,
	currencySale?: number,
	in?: [ITovar]

}
export interface ITovarCatalog {
    [key: string]: ITovar
}
const createTable: string = `CREATE TABLE IF NOT EXISTS tovar (
	id SERIAL PRIMARY KEY,
	old_code INTEGER,
	path ltree /*NOT NULL */,
	type VARCHAR (10),
	name VARCHAR ( 150 ) NOT NULL,
	okei INTEGER REFERENCES okei,
	oksm INTEGER REFERENCES oksm,
	nds INTEGER REFERENCES nds,
	minost decimal,
	currency_accounting INTEGER REFERENCES currency,
	currency_sale INTEGER REFERENCES currency,
	created TIMESTAMP NOT NULL,
	updated TIMESTAMP NOT NULL,
	deleted TIMESTAMP
		-- parent  INTEGER REFERENCES tovar (id) ON DELETE CASCADE, 
    );`
export default class Tovar {
    
}

