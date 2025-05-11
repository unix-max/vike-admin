import { IFirm } from "../spr/Firm";
import { IFirmAccount } from "../spr/FirmAccount";
import { IClient } from "../spr/Client";
import { ISklad } from "../spr/Sklad";
import { ICurrency } from "../spr/Currency";
import { INDS } from "../spr/Nds";
export interface ISchet {
  [key: string]: any,
  id: number,
  //number: string;
  date: number,
  oldCode?: number,
  firm?: IFirm,
  firm_acc?: IFirmAccount,
  client?: IClient,
  sklad?: ISklad,
  currency?: ICurrency,
  nds?: INDS,
  descript?: string,
  alias?: string,
  created?: Date,
  updated?: Date,
  deleted?: Date
};

export interface ISchetTbl {
  id: number,
  docId: number,
  oldCode?: number,
  tovar: number,
  okei: number,
  qty: number,
  price: number,
  sum: number,
  nds: number,
  created?: Date,
  updated?: Date,
  deleted?: Date
};
const createTable: string = `
CREATE TABLE IF NOT EXISTS schet_doc (
	id serial PRIMARY KEY,
  number VARCHAR (15) UNIQUE,
  date TIMESTAMPTZ NOT NULL,
	old_code INTEGER,
	firm INTEGER REFERENCES firm,
  firm_acc INTEGER REFERENCES firm_account,
  client INTEGER REFERENCES client,
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