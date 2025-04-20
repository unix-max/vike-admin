import React from 'react'
import { trpc } from "@/trpc/client";
//import {Window, IWinProps} from '../Window'
import { useWinStore } from '@/pages/+client'
import { WindowCl } from '../../Window/winCl'
import { TabPanel, TabItem} from '../../Tabs';
import { BankSpr } from '../BankSpr';
import { CurrencySpr } from '../CurrencySpr';
import { AccTypeSpr } from '../AccTypeSpr';
import { IClientAccount } from '@/db/Entitys/ClientAccount';
import { SuperInput } from '../../inputs/SuperInput';
import { SprInput } from '@/components/inputs/SprInput';
//import styles from './index.module.css'
const addTWin = useWinStore.getState().addTWin
const delNWin = useWinStore.getState().delNWin;

type IClientAccElmProps  = {
	elmId?: number;
	clientId?: number;
	renew?: () => void;
}
type TWinId = IClientAccElmProps & { winId: number }

type IClientAccElmState = {
	[key: string]: any
}
//const { data: elm, error: e1 } = useSWR(`/api/spr/client/elm/${props.elmId}`, fetcher);
export class ClientAccElm extends React.Component<TWinId, IClientAccElmState>{
	newElmData: IClientAccElmState;
	oldElmData: IClientAccElmState;

	constructor(props: TWinId) {
		super(props);
		this.newElmData = {};
		this.oldElmData = {};
	}
	async componentDidMount() {
	
		if(this.props.elmId) {
			const data = await trpc.spr.client.getAccElm.query({ id: this.props.elmId});
			if (data) this.oldElmData = data.elm as IClientAccount;
		} else {
			
			this.oldElmData = {id: 0, name: 'Новый'};
			this.newElmData = {id: 0, name: 'Новый'};
		}
		this.forceUpdate();
	}

	changeData= (key: string, val: any) => {
		if (typeof val == 'object') {
			this.oldElmData[key] = val.name;
			this.newElmData[key] = val.id;
			this.forceUpdate();
		} else {
			this.oldElmData[key] = val;
			this.newElmData[key] = val;
		}
		
	}

	dataSend= async () => {
		let data: any;
		try {
			if (this.props.elmId) {
				data = await trpc.spr.client.setAccElm.mutate({ id: this.props.elmId, ...this.newElmData });
			} else {
				data = await trpc.spr.client.setAccElm.mutate({ client_id: this.props.clientId,  ...this.newElmData });
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

		console.log(`Render sprElm ${this.props.elmId}`)
		return (           
		<WindowCl winId={this.props.winId} caption={`${this.oldElmData.name} id:${this.oldElmData.id}`} modal={false} key={this.props.winId}>
			<form className="main">
        <fieldset>
          <legend>Основные</legend>
				
            <table>
							<tbody>
                
								<tr>
									<td><SuperInput zagolovok="Наименование" value={this.oldElmData.name} onChange={(val) => this.changeData('name', val)}/></td>
									<td><SprInput zagolovok="Тип" value={this.oldElmData.type}
									onBtnClick={() => addTWin(AccTypeSpr, { onChoice: (elm: any) => this.changeData('type', elm) })}/></td>
					
									<td><SuperInput zagolovok="Номер" value={this.oldElmData.number} onChange={(val) => this.changeData('number', val)}/></td>
								</tr>
								<tr>
									<td><SprInput zagolovok="Банк" value={this.oldElmData.bank} 
									onBtnClick={() => addTWin(BankSpr, { onChoice: (elm: any) => this.changeData('bank', elm) })}/></td>
									<td><SprInput zagolovok="Валюта" value={this.oldElmData.currency}
									 onBtnClick={() => addTWin(CurrencySpr, { onChoice: (elm: any) => this.changeData('currency', elm) })}/></td>	
									<td><SuperInput zagolovok="Основной" value={this.oldElmData.main} onChange={(val) => this.changeData('main', val)}/></td>
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
	
