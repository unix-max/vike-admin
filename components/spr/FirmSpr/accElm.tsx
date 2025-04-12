import React from 'react'
import { trpc } from "@/trpc/client";
//import {Window, IWinProps} from '../Window'
import { useWinStore } from '@/pages/+client'
import { WindowCl } from '../../Window/winCl'
import { TabPanel, TabItem} from '../../Tabs';
import { IFirmAccount } from '@/db/Entitys/FirmAccount';
import { SuperInput } from '../../inputs/SuperInput';
//import styles from './index.module.css'
const delNWin = useWinStore.getState().delNWin;

type IFirmAccElmProps  = {
	elmId?: number;
	firmId?: number;
	renew?: () => void;
}
type TWinId = IFirmAccElmProps & { winId: number }

type IFirmAccElmState = {
	[key: string]: any
}
//const { data: elm, error: e1 } = useSWR(`/api/spr/client/elm/${props.elmId}`, fetcher);
export class FirmAccElm extends React.Component<TWinId, IFirmAccElmState>{
	newElmData: IFirmAccElmState;
	oldElmData: IFirmAccElmState;

	constructor(props: TWinId) {
		super(props);
		this.newElmData = {};
		this.oldElmData = {};
	}
	async componentDidMount() {
	
		if(this.props.elmId) {
			const data = await trpc.spr.firm.getAccElm.query({ id: this.props.elmId});
			if (data) this.oldElmData = data.elm as IFirmAccount;
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
				data = await trpc.spr.firm.setAccElm.mutate({ id: this.props.elmId, ...this.newElmData });
			} else {
				data = await trpc.spr.firm.setAccElm.mutate({ firm_id: this.props.firmId,  ...this.newElmData });
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
									<td><SuperInput zagolovok="Тип" value={this.oldElmData.type} onChange={(val) => this.changeData('type', val)}/></td>	
									<td><SuperInput zagolovok="Номер" value={this.oldElmData.number} onChange={(val) => this.changeData('number', val)}/></td>
								</tr>
								<tr>
									<td><SuperInput zagolovok="Банк" value={this.oldElmData.bank} onChange={(val) => this.changeData('bank', val)}/></td>
									<td><SuperInput zagolovok="Валюта" value={this.oldElmData.currency} onChange={(val) => this.changeData('currency', val)}/></td>	
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
	
