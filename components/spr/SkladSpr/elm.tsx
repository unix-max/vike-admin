import React from 'react'
import { trpc } from "@/trpc/client";
//import {Window, IWinProps} from '../Window'
import { useWinStore } from '@/pages/+client'
import { WindowCl } from '../../Window/winCl'
import { TabPanel, TabItem} from '../../Tabs';

import { SuperInput } from '../../inputs/SuperInput';
//import { SprInput } from '@/components/inputs/SprInput';

//import styles from './index.module.css'
//const addTWin = useWinStore.getState().addTWin;
const delNWin = useWinStore.getState().delNWin;

type ISkladElmProps  = {
	elmId?: number;
	renew?: () => void;
}

type TWinId = ISkladElmProps & { winId: number }

type ISkladElmState = {
	[key: string]: any
}

export class SkladElm extends React.Component<TWinId, ISkladElmState>{
	newElmData: ISkladElmState;
	oldElmData: ISkladElmState;

	constructor(props: TWinId) {
		super(props);
		this.newElmData = {};
		this.oldElmData = {};
	}
	async componentDidMount() {
		if(this.props.elmId) {
			const data = await trpc.spr.sklad.getElm.query({ id: this.props.elmId});
			if (data) this.oldElmData = data.elm;
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
		} else {
			this.oldElmData[key] = val;
			this.newElmData[key] = val;
		}
		
		//this.setState( {[key]: val})
		console.log(this.oldElmData);
		console.log(this.newElmData);
		//if (key=='name')
		this.forceUpdate();
	}

	dataSend= async () => {
		let data: any;
		try {
			if (this.props.elmId) {
				data = await trpc.spr.sklad.setElm.mutate({ id: this.props.elmId, ...this.newElmData });
			} else {
				data = await trpc.spr.sklad.setElm.mutate({ ...this.newElmData });
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

	changeMOL=() => {
		//addNWin(OKSMSpr, {winId: Date.now(), onChoice: (elm: any) => this.changeData('oksm', elm) });
	}
	name=() =>`Склад ${this.oldElmData.name}`;

	render() {
		//if (!Object.hasOwn(this.oldElmData, 'id')) return;
		console.log(`Render SkladsprElm ${this.props.elmId}`)
		return (           
		<WindowCl winId={this.props.winId} caption={this.name()} modal={false} key={this.props.winId}>
					<form className="main">
        		<fieldset>
              <legend>Основные</legend>
                <table>
									<tbody>
                  <tr>
                    <td><SuperInput zagolovok="Наименование" value={this.oldElmData.name} onChange={(val) => this.changeData('name', val)}/></td>
										<td><SuperInput zagolovok="В документы" value={this.oldElmData.indoc} onChange={(val) => this.changeData('indoc', val)}/></td>
                    <td><SuperInput zagolovok="МОЛ" value={this.oldElmData.mol} onChange={(val) => this.changeData('mol', val)}/></td>      
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
	
