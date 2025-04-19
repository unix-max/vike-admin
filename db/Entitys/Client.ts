export interface IClient {
	[key: string]: any,
    id: number,
	oldCode?: number,
	path?: string,
	type?: string,
  name?: string,
	level?: number,
    parent?: IClient,
	parentId?: number,       
	nomer?: number,
	indoc?: string,
	inn?: string,
	kpp?: string,
	ogrn?: string,
	address?: string,
	urAddress?: string,
	phone?: string,
	email?: string,
	www?: string,
	nds?: number,
	np?: number,
	created?: Date,
	updated?: Date,
	deleted?: Date,

	in?: [IClient]

}
export interface IClientCatalog {
    [key: string]: any,
		id?: number,
		oldCode?: number,
		path?: string,
		type?: string,
			name?: string,
		level?: number,
			parent?: IClient,
		parentId?: number,  
}
const createTable: string = `CREATE TABLE IF NOT EXISTS client (
	id serial PRIMARY KEY,
	old_code INTEGER,
	path ltree /*NOT NULL */,
	type VARCHAR (10),
	name VARCHAR ( 200 ),
	nomer INTEGER,
	inDoc VARCHAR (200),
	inn VARCHAR (12),
	kpp VARCHAR (9),
	ogrn VARCHAR (13),
	address VARCHAR (150),
	urAddress VARCHAR (150),
	addr jsonb not null default '{}'::jsonb,
	ur_addr jsonb not null default '{}'::jsonb,
	phone VARCHAR (50),
	email VARCHAR (100),
	www VARCHAR (100),
	main_acc INTEGER REFERENCES client_account,
	tax_sys tax_sys,
	created TIMESTAMPZ NOT NULL DEFAULT now(),
	updated TIMESTAMPZ NOT NULL DEFAULT now(),
	deleted TIMESTAMPZ
	
    );
		CREATE INDEX client_path_idx ON client USING BTREE (path);
		CREATE INDEX client_path_gist_idx ON client USING GIST (path);

		CREATE OR REPLACE FUNCTION create_query_list(t_name text, parrent_id Integer) RETURNS text AS
		$$
		DECLARE
				query_a text := format('SELECT * FROM %I WHERE ', t_name);
		BEGIN
			IF parrent_id = 0 THEN
				query_a := query_a || 'path is null ';
			ELSE
				query_a := query_a || 'subpath(path, -1) = text2ltree($1) ';
			END IF;
			query_a := query_a || 'ORDER BY name;';
			RETURN query_a;
		END;
		$$ 
		LANGUAGE plpgsql STABLE;

	CREATE OR REPLACE FUNCTION client_list(parrent_id Integer) RETURNS SETOF client AS
$$
BEGIN
	RETURN QUERY EXECUTE create_query_list('client', parrent_id)
	USING parrent_id::varchar(20);
	RETURN;
END;
$$ 
LANGUAGE plpgsql STABLE;

CREATE FUNCTION client_parrent_id(client client) RETURNS text AS $$
  SELECT subpath(client.path, -1)
$$ LANGUAGE sql STABLE;

CREATE FUNCTION client_level(client client) RETURNS text AS $$
  SELECT COALESCE(nlevel(client.path),0)
$$ LANGUAGE sql STABLE;
    
		`
	export default class Client  {
	id?: number
    oldCode?: number
	name?: string
    parent?: number
	nomer?: number
	inDoc?: string
	inn?: string
	kpp?: string
	ogrn?: string
	address?: string
	urAdress?: string
	phone?: string
	email?: string
	www?: string
	created?: Date;
	updated?: Date;
	deleted?: Date;
    nds?: number;
    np?: number;
}