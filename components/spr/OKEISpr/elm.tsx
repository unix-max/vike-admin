import React from 'react'
import { trpc } from "@/trpc/client";
//import {Window, IWinProps} from '../Window'
import { useWinStore } from '@/pages/+client'
import { WindowCl } from '../../Window/winCl'
import { TabPanel, TabItem} from '../../Tabs';
import { IOKEI } from '@/db/Entitys/spr/OKEI';
import { SuperInput } from '../../inputs/SuperInput';
//import styles from './index.module.css'
const delNWin = useWinStore.getState().delNWin;

type OKEIElmProps  = {
	elmId?: number;
	renew?: () => void;
}
type TWinId = OKEIElmProps & { winId: number }

type OKEIElmState = {
	[key: string]: any
}
//const { data: elm, error: e1 } = useSWR(`/api/spr/client/elm/${props.elmId}`, fetcher);
export class OKEIElm extends React.Component<TWinId, OKEIElmState>{
	newElmData: OKEIElmState;
	oldElmData: OKEIElmState;

	constructor(props: TWinId) {
		super(props);
		this.newElmData = {};
		this.oldElmData = {};
	}
	async componentDidMount() {
		this.reload();
	}
	
	reload = async ()=> {
		if(this.props.elmId) {
			const data = await trpc.spr.okei.getElm.query({ id: this.props.elmId});
			if (data) this.oldElmData = data.elm as IOKEI;
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
		if (Object.keys(this.newElmData).length > 0) {
			let data: any;
			try {
				if (this.props.elmId) {
					data = await trpc.spr.okei.setElm.mutate({ id: this.props.elmId, ...this.newElmData });
				} else {
					data = await trpc.spr.okei.setElm.mutate({ ...this.newElmData });
				}
			} catch (e: any) {
				console.log(e);
			}
			if (data && 'elm' in data) {
				if ( this.props.renew && data?.elm?.id > 0 ) this.props.renew();
			} else alert(data?.message);
		}
		delNWin(this.props.winId);
		//console.log(id)	

	}
	name=() =>'OKEI Elm'
	render() {

		console.log(`Render OKEISprElm ${this.props.elmId}`)
		return (           
		<WindowCl winId={this.props.winId} caption={`${this.oldElmData.name} id:${this.oldElmData.id}`} modal={false} key={this.props.winId}>
			<form className="main">
        <fieldset>
          <legend>Основные</legend>
				
            <table>
							<tbody>
								<tr>
									<td><SuperInput zagolovok="Код" value={this.oldElmData.code} onChange={(val) => this.changeData('code', val)}/></td>
									<td><SuperInput zagolovok="Наименование" value={this.oldElmData.name} onChange={(val) => this.changeData('name', val)}/></td>
									<td><SuperInput zagolovok="Alias" value={this.oldElmData.alias} onChange={(val) => this.changeData('alias', val)}/></td>
								</tr>
								<tr>
									<td><SuperInput zagolovok="Сокр рус" value={this.oldElmData.sokr_rus} onChange={(val) => this.changeData('sokr_rus', val)}/></td>
									<td><SuperInput zagolovok="Сокр межд" value={this.oldElmData.sokr_int} onChange={(val) => this.changeData('sokr_int', val)}/></td>

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
	
