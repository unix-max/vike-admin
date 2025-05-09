
const createTable: string = `
CREATE TABLE IF NOT EXISTS schet_doc (
	id serial PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL,
	old_code INTEGER,
	firm INTEGER REFERENCES firm,
  schet INTEGER REFERENCES firm_account,
  klient INTEGER REFERENCES client,
  sklad INTEGER REFERENCES sklad,
  currency INTEGER REFERENCES currency,
  nds INTEGER REFERENCES nds,
	descript VARCHAR ( 150 ),
	alias VARCHAR (15),
	created TIMESTAMPTZ NOT NULL,
	updated TIMESTAMPTZ NOT NULL,
	deleted TIMESTAMPTZ
  );`

const createTable1: string = `
CREATE TABLE IF NOT EXISTS schet_doc_tbl (
	id serial PRIMARY KEY,
  doc_id INTEGER REFERENCES schet_doc ON DELETE CASCADE,
	old_code INTEGER,
	tovar INTEGER REFERENCES tovar,
  okei INTEGER REFERENCES okei,
  qty NUMERIC(12, 3),
  price NUMERIC(12, 2),
  sum NUMERIC(12, 2),
  nds NUMERIC(9, 2),
  created TIMESTAMPTZ NOT NULL,
  updated TIMESTAMPTZ NOT NULL,
  deleted TIMESTAMPTZ
  );`