import React from 'react'
import { trpc } from "@/trpc/client";
//import {Window, IWinProps} from '../Window'
import { useWinStore } from '@/pages/+client'
import { WindowCl } from '../../Window/winCl'
import { TabPanel, TabItem} from '../../Tabs';
import { ICity } from '@/db/Entitys/City';

import { SuperInput } from '../../inputs/SuperInput';
import { SprInput } from '@/components/inputs/SprInput';
import { OKSMSpr } from '../OKSMSpr';

//import styles from './index.module.css'
const addNWin = useWinStore.getState().addNWin
const delNWin = useWinStore.getState().delNWin

type ICityElmProps  = {
	winId: number;
	elmId?: number;

	renew?: () => void;
}

type ICityElmState = {
	[key: string]: any
}
//const { data: elm, error: e1 } = useSWR(`/api/spr/client/elm/${props.elmId}`, fetcher);
export class CityElm extends React.Component<ICityElmProps, ICityElmState>{
	newElmData: ICityElmState;
	oldElmData: ICityElmState;

	constructor(props: ICityElmProps) {
		super(props);
		this.newElmData = {};
		this.oldElmData = {};
	}
	async componentDidMount() {
		if(this.props.elmId) {
			const data = await trpc.spr.city.getElm.query({ id: this.props.elmId});
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
				data = await trpc.spr.city.setElm.mutate({ id: this.props.elmId, ...this.newElmData });
			} else {
				data = await trpc.spr.city.setElm.mutate({ ...this.newElmData });
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
	changeOksm=() => {
		addNWin(OKSMSpr, {winId: Date.now(), onChoice: (elm: any) => this.changeData('oksm', elm) });
	}
	name = () => 'City'
	
	render() {
		//if (!Object.hasOwn(this.oldElmData, 'id')) return;
		console.log(`Render sprElm ${this.props.elmId}`)
		return (           
		<WindowCl winId={this.props.winId} caption={this.oldElmData.name} modal={false}>
			<form className="main">
        		<fieldset>
              <legend>Основные</legend>
                <table>
									<tbody>
                  <tr>
                    <td><SuperInput zagolovok="Наименование" value={this.oldElmData.name} onChange={(val) => this.changeData('name', val)}/></td>
										<td><SuperInput zagolovok="Полное наименование" value={this.oldElmData.full_name} onChange={(val) => this.changeData('full_name', val)}/></td>
										<td><SprInput zagolovok="Страна" value={this.oldElmData.oksm} onBtnClick={this.changeOksm}/></td>
                        
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
	
