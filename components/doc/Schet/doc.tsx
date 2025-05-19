import React from 'react'
import { trpc } from "@/trpc/client";
//import {Window, IWinProps} from '../Window'
import { useWinStore } from '@/pages/+client'
import { WindowCl } from '../../Window/winCl'
import { TabPanel, TabItem} from '../../Tabs';
import { mainData } from '@/helpers/mainData';
import { ISchet, ISchetTbl } from '@/db/Entitys/doc/Schet';
import { SuperInput } from '../../inputs/SuperInput';
import { SprInput } from '@/components/inputs/SprInput';
import { FirmSpr } from '@/components/spr/FirmSpr';
import { FirmAccSpr } from '@/components/spr/FirmAccSpr';
import { KlientSpr } from '@/components/spr/KlientSpr';
import { SkladSpr } from '@/components/spr/SkladSpr';
import { CurrencySpr } from '@/components/spr/CurrencySpr';
import { NDSSpr } from '@/components/spr/NdsSpr';
//import styles from './index.module.css'
const addTWin = useWinStore.getState().addTWin
const delNWin = useWinStore.getState().delNWin;

type SchetDocProps  = {
	elmId?: number;
	renew?: () => void;
}
type TWinId = SchetDocProps & { winId: number }

type SchetDocState = {
	[key: string]: any
}
const dt =(ts: number):string => {
	const date = new Date(ts);
	const yyyy = date.getFullYear();
	const mm = (date.getMonth()+1).toString().padStart(2,"0");
	const dd= date.getDate().toString().padStart(2, "0");
	return `${dd}/${mm}/${yyyy}`
}
//const { data: elm, error: e1 } = useSWR(`/api/spr/client/elm/${props.elmId}`, fetcher);
export class SchetDoc extends React.Component<TWinId, SchetDocState>{
	newElmData: SchetDocState;
	oldHeadData: ISchet;
	oldTblData: ISchetTbl[];

	constructor(props: TWinId) {
		super(props);
		this.newElmData = {};
		this.oldHeadData = {id:0, date: Date.now()};
		this.oldTblData = [];
	}

	async componentDidMount() {
		if(this.props.elmId) {
			const data = await trpc.doc.schet.getDoc.query({ id: this.props.elmId});
			if (data) {
				this.oldHeadData = data.doc?.head as ISchet;
				this.oldTblData = data.doc?.tbl as ISchetTbl[];
			}	
		this.forceUpdate();
		}
	}

changeData= (key: string, val: any) => {
		if (typeof val == 'object') {
			this.oldHeadData[key] = val;
			this.newElmData[key] = val.id;
			this.forceUpdate();
		} else {
			this.oldHeadData[key] = val;
			this.newElmData[key] = val;
		}
		
	}

	dataSend= async () => {
		let data: any;
		try {
			if (this.props.elmId) {
				data = await trpc.spr.nds.setElm.mutate({ id: this.props.elmId, ...this.newElmData });
			} else {
				data = await trpc.spr.nds.setElm.mutate({ ...this.newElmData });
			}
		} catch (e: any) {
			console.log(e);
		}
		if (data && 'elm' in data) {
			if ( this.props.renew && data?.elm?.id > 0 ) this.props.renew();
		} else alert(data?.message);

		delNWin(this.props.winId);
		//console.log(id)	

	}
	name=() =>'Счет'
	render() {

		console.log(`Render shetDoc ${this.props.elmId}`)
		return (           
		<WindowCl winId={this.props.winId}
			caption={`Счет №: ${this.oldHeadData.id} от ${dt(this.oldHeadData.date)}`}
			modal={false} key={this.props.winId}>
			<form className="main">
        <fieldset>
          <legend>Основные</legend>
				
            <table>
							<tbody>
								<tr>
									<td><SuperInput zagolovok="ID" value={this.oldHeadData.id} onChange={(val) => this.changeData('name', val)}/></td>
									<td><SuperInput zagolovok="Дата" value={dt(this.oldHeadData.date)} onChange={(val) => this.changeData('val', val)}/></td>
									<td><SuperInput zagolovok="Alias" value={this.oldHeadData.descript} onChange={(val) => this.changeData('alias', val)}/></td>
						
								</tr>
								<tr>
									<td><SprInput zagolovok="Фирма" value={this.oldHeadData.firm?.name} 
										onBtnClick={() => addTWin(FirmSpr, { onChoice: (elm: any) => this.changeData('firm', elm) })}/></td>
									<td><SprInput zagolovok="Счет" value={this.oldHeadData.firm_acc?.name} 
										onBtnClick={() => addTWin(FirmAccSpr, {firmId: 1, onChoice: (elm: any) => this.changeData('firm_acc', elm) })}/></td>
									<td><SprInput zagolovok="Клиент" value={this.oldHeadData.client?.name} 
										onBtnClick={() => addTWin(KlientSpr, { onChoice: (elm: any) => this.changeData('client', elm) })}/></td>
								</tr>
								<tr>
									<td><SprInput zagolovok="Склад" value={this.oldHeadData.sklad?.name} 
										onBtnClick={() => addTWin(SkladSpr, { onChoice: (elm: any) => this.changeData('sklad', elm) })}/></td>
									<td><SprInput zagolovok="Валюта" value={this.oldHeadData.currency?.name} 
										onBtnClick={() => addTWin(CurrencySpr, { onChoice: (elm: any) => this.changeData('currency', elm) })}/></td>
									<td><SprInput zagolovok="НДС" value={this.oldHeadData.nds?.name} 
										onBtnClick={() => addTWin(NDSSpr, { onChoice: (elm: any) => this.changeData('nds', elm) })}/></td>
								</tr>
							</tbody>
            </table>
					
						
          </fieldset>
        </form>
			<button onClick={this.dataSend}>OK</button>
			<button onClick={() => delNWin(this.props.winId)}>Отмена</button>
		</WindowCl>
	)
	}
}
	
