import React from 'react'
import { trpc } from "@/trpc/client";
//import {Window, IWinProps} from '../Window'
import { useWinStore } from '@/pages/+client'
import { WindowCl } from '../../Window/winCl'
import { TabPanel, TabItem} from '../../Tabs';
import { SuperInput } from '../../inputs/SuperInput';
import type { ExtRateRecDto } from '@/trpc/api/spr/currency/getRateElm';
//import styles from './index.module.css'

const delNWin = useWinStore.getState().delNWin;

export type CurrencyRateElmProps  = {
	elmId?: number;
	renew?: () => void;
}

type TWinId = CurrencyRateElmProps & { winId: number }

type CurrencyElmState = {
	[key: string]: any
}
//const { data: elm, error: e1 } = useSWR(`/api/spr/client/elm/${props.elmId}`, fetcher);
export class CurrencyRateElm extends React.Component<TWinId, CurrencyElmState>{
	newElmData: CurrencyElmState;
	oldElmData: CurrencyElmState;

	constructor(props: TWinId) {
		super(props);
		this.newElmData = {};
		this.oldElmData = {};
	}

	async componentDidMount() {
		if(this.props.elmId) {
			const data = await trpc.spr.currency.getRateElm.query({ id: this.props.elmId});
			if (data) this.oldElmData = data.elm as ExtRateRecDto;
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
		<WindowCl 
				winId={this.props.winId}
				caption={`${this.name()} id:${this.oldElmData.id}`}
				modal={false}
				key={this.props.winId}
				size={{width: '200px', height: '300px'}}>
					
			<form className="main">
        <fieldset>
          <legend>Основные</legend>
						<h3>Курс {this.oldElmData.name} {this.oldElmData.sokr}</h3>
            <table>
							<tbody>
                <tr>
									<td><SuperInput zagolovok="ID" type="number" value={this.oldElmData.id} onChange={(val) => this.changeData('id', val)}/></td>
                  <td><SuperInput zagolovok="Начало"  value={this.oldElmData.begin} onChange={(val) => this.changeData('begin', val)}/></td>
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
	
