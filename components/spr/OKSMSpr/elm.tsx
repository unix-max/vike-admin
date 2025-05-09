import React from 'react'
import { trpc } from "@/trpc/client";
//import {Window, IWinProps} from '../Window'
import { useWinStore } from '@/pages/+client'
import { WindowCl } from '../../Window/winCl'
import { TabPanel, TabItem} from '../../Tabs';
import { IOKSM } from '@/db/Entitys/spr/OKSM';
import { SuperInput } from '../../inputs/SuperInput';
//import styles from './index.module.css'
const delNWin = useWinStore.getState().delNWin;

type IOKSMElmProps  = {
	elmId?: number;
	renew?: () => void;
}
type TWinId = IOKSMElmProps & { winId: number }

type IOKSMElmState = {
	[key: string]: any
}
//const { data: elm, error: e1 } = useSWR(`/api/spr/client/elm/${props.elmId}`, fetcher);
export class OKSMElm extends React.Component<TWinId, IOKSMElmState>{
	newElmData: IOKSMElmState;
	oldElmData: IOKSMElmState;

	constructor(props: TWinId) {
		super(props);
		this.newElmData = {};
		this.oldElmData = {};
	}
	async componentDidMount() {
	
		if(this.props.elmId) {
			const data = await trpc.spr.oksm.getElm.query({ id: this.props.elmId});
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
				data = await trpc.spr.oksm.setElm.mutate({ id: this.props.elmId, ...this.newElmData });
			} else {
				data = await trpc.spr.oksm.setElm.mutate({ ...this.newElmData });
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
	name=() =>`ОКСМ ${this.oldElmData.name}`;
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
								
                  <td><SuperInput zagolovok="Наименование" value={this.oldElmData.name} onChange={(val) => this.changeData('name', val)}/></td>
									<td><SuperInput zagolovok="Полное наименование" value={this.oldElmData.full_name} onChange={(val) => this.changeData('full_name', val)}/></td>
									<td><SuperInput zagolovok="OKSM" type="number" value={this.oldElmData.code} onChange={(val) => this.changeData('code', val)}/></td>
                        
                </tr>
								<tr>
									<td><SuperInput zagolovok="A2" value={this.oldElmData.a2} onChange={(val) => this.changeData('a2', val)}/></td>
									<td><SuperInput zagolovok="A3" value={this.oldElmData.a3} onChange={(val) => this.changeData('a3', val)}/></td>
									<td><SuperInput zagolovok="Alias" value={this.oldElmData.alias} onChange={(val) => this.changeData('alias', val)}/></td>
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
	
