import { router, publicProcedure } from "@/trpc/server";
import type { Context } from "@/server/trpc-handler";
import type { PoolClient } from "pg";
import format from 'pg-format'
import { z } from 'zod';
import { ITovar, ITovarCatalog } from '@/db/Entitys/spr/Tovar'

const requestShema = z.object({
  id: z.number()
})


export const tovarSprGetElm = router({
  getElm: publicProcedure
  .input(requestShema)
  .query(async (opts) => {
    const { input } = opts;
    console.log(input.id)
    
    const { pool } = opts.ctx as Context;

    const query: string = format(`
   SELECT
      t.id AS tovar_id,
      t.old_code AS tovar_old_code,
      t.path AS tovar_path,
      t.type AS tovar_type,
      t.name AS tovar_name,
      t.okei AS tovar_okei_id,
      t.oksm AS tovar_oksm_id,
      t.nds AS tovar_nds_id,
      t.minost AS tovar_minost,
      t.currency_accounting AS tovar_cur_acc_id,
      t.currency_sale AS tovar_cur_sale_id,
      okei.name AS okei_name,
      oksm.name AS oksm_name,
      nds.name AS nds_name,
      cur_acc.name AS cur_acc_name,
      cur_sale.name AS cur_sale_name
      FROM tovar AS t
      LEFT JOIN okei AS okei ON okei.id = t.okei
      LEFT JOIN oksm AS oksm ON oksm.id = t.oksm
      LEFT JOIN nds AS nds ON nds.id = t.nds
      LEFT JOIN currency AS cur_acc ON cur_acc.id = t.currency_accounting
      LEFT JOIN currency AS cur_sale ON cur_sale.id = t.currency_sale
    WHERE t.id = %1$L;`, input.id);
 // console.log(query, input.id)

    try {
      const dbClient: PoolClient = await pool.connect();
      const res = await dbClient.query(query);
      dbClient.release();
      const item = res.rows[0];
      const tovarList = {
        id: item.tovar_id,
        name: item.tovar_name,
        okei: item.okei_name,
        oksm: item.oksm_name,
        nds:  item.nds_name,
        currency_accounting: item.cur_acc_name,
        currency_sale: item.cur_sale_name,
        minost: item.tovar_minost
      }
      return {elm: tovarList, tc: pool.totalCount, ic: pool.idleCount}
    } catch(err) {
      console.log("Error", err);
    }
    
  })
})