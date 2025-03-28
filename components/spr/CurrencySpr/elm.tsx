import React from 'react'
import { trpc } from "@/trpc/client";
//import {Window, IWinProps} from '../Window'
import { useWinStore } from '@/pages/+client'
import { WindowCl } from '../../Window/winCl'
import { TabPanel, TabItem} from '../../Tabs';
import { IOKSM } from '@/db/Entitys/OKSM';
import { SuperInput } from '../../inputs/SuperInput';
//import styles from './index.module.css'
const delNWin = useWinStore.getState().delNWin;

type CurrencyElmProps  = {
	winId: number;
	elmId?: number;
	renew?: () => void;
}

type CurrencyElmState = {
	[key: string]: any
}
//const { data: elm, error: e1 } = useSWR(`/api/spr/client/elm/${props.elmId}`, fetcher);
export class CurrencyElm extends React.Component<CurrencyElmProps, CurrencyElmState>{
	newElmData: CurrencyElmState;
	oldElmData: CurrencyElmState;

	constructor(props: CurrencyElmProps) {
		super(props);
		this.newElmData = {};
		this.oldElmData = {};
	}
	async componentDidMount() {
	
		if(this.props.elmId) {
			const data = await trpc.spr.currency.getElm.query({ id: this.props.elmId});
			if (data) this.oldElmData = data.elm;
		} else {
			
			this.oldElmData = {id: 0, name: 'Новый'};
			this.newElmData = {id: 0, name: 'Новый'};
		}
		this.forceUpdate();
	}

	changeData= (key: string, val: any) => {
		this.oldElmData[key] = val;
		this.newElmData[key] = val;
		//this.setState( {[key]: val})
		console.log(this.newElmData);
		//if (key=='name')
		//this.forceUpdate();
	}

	dataSend= async () => {
		let data: any;
		try {
			if (this.props.elmId) {
				data = await trpc.spr.currency.setElm.mutate({ id: this.props.elmId, ...this.newElmData });
			} else {
				data = await trpc.spr.currency.setElm.mutate({ ...this.newElmData });
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
	name=() =>`Валюта ${this.oldElmData.name}`;
	render() {

		console.log(`Render sprElm ${this.props.elmId}`)
		return (           
		<WindowCl winId={this.props.winId} caption={`${this.name()} id:${this.oldElmData.id}`} modal={false} key={this.props.winId}>
			<form className="main">
        <fieldset>
          <legend>Основные</legend>
				
            <table>
							<tbody>
                <tr>
									<td><SuperInput zagolovok="Code" type="number" value={this.oldElmData.code} onChange={(val) => this.changeData('code', val)}/></td>
                  <td><SuperInput zagolovok="Sokr"  value={this.oldElmData.sokr} onChange={(val) => this.changeData('sokr', val)}/></td>
									<td><SuperInput zagolovok="Symbol" value={this.oldElmData.symbol} onChange={(val) => this.changeData('symbol', val)}/></td>
									
                </tr>
								<tr>
									<td><SuperInput zagolovok="Наименование" value={this.oldElmData.name} onChange={(val) => this.changeData('name', val)}/></td>
									<td><SuperInput zagolovok="Alias" value={this.oldElmData.alias} onChange={(val) => this.changeData('alias', val)}/></td>
									<td><SuperInput zagolovok="Курс" value={this.oldElmData.rate} onChange={(val) => this.changeData('rate', val)}/></td>
	
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
	
