import React from 'react'
import { trpc } from "@/trpc/client";
//import {Window, IWinProps} from '../Window'
import { useWinStore } from '@/pages/+client'
import { WindowCl } from '../../Window/winCl'
import { TabPanel, TabItem} from '../../Tabs';
import { CurrencySpr } from '../CurrencySpr';
import { OKEISpr } from '../OKEISpr';
import { OKSMSpr } from '../OKSMSpr';
import { ITovar } from '@/db/Entitys/spr/Tovar';
import { SuperInput } from '../../inputs/SuperInput';
import { SprInput } from '@/components/inputs/SprInput';
import { NDSSpr } from '../NdsSpr';
//import styles from './index.module.css'
const addTWin = useWinStore.getState().addTWin
const delNWin = useWinStore.getState().delNWin;

type ITovarElmProps  = {
	elmId?: number;
	parentId?: number;
	renew?: () => void;
}

type TWinId = ITovarElmProps & { winId: number }

type ITovarElmState = {
	[key: string]: any
}
//const { data: elm, error: e1 } = useSWR(`/api/spr/client/elm/${props.elmId}`, fetcher);
export class TovarElm extends React.Component<TWinId, ITovarElmState>{
	newElmData: ITovarElmState;
	oldElmData: ITovarElmState;
	path: string| null;

	constructor(props: TWinId) {
		super(props);
		this.newElmData = {};
		this.oldElmData = {};
		this.path = null; 
	}
	async componentDidMount() {
			this.reload();
		}
		
	reload = async ()=> {
		//console.log(this?.props?.parentId)
		if(this.props.elmId) {
			const data = await trpc.spr.tovar.getElm.query( {id: this.props.elmId});
			if (data) this.oldElmData = data.elm;
				console.log(data)
			} else {
				this.oldElmData = {id: 0, name: 'Новый'};
				this.newElmData = {id: 0, name: 'Новый'};
			}
		this.forceUpdate();
	}
	
	componentDidUpdate(prevProps: Readonly<ITovarElmProps>, prevState: Readonly<ITovar>, snapshot?: any): void {
		// console.log(testTreeData===this.state.treeData)
		console.log(this.newElmData)
	 }
	 /*getData=(key: string) => {
		//console.log(this.state[key])
		if (this.newElmData[key]) return this.newElmData[key];
		return this.state[key]
	 } */
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
		if (Object.keys(this.newElmData).length > 0) {
			let data: any;
		try {
			if (this.props.elmId) {
				data = await trpc.spr.tovar.setElm.mutate({ id: this.props.elmId, ...this.newElmData });
			} else {
				data = await trpc.spr.tovar.setElm.mutate({ parentId: this.props.parentId, type: 'E', ...this.newElmData });
			}
		} catch (e: any) {
			console.log(e);
		}
		if ('elm' in data) {
			const id =  data?.elm?.id;
			if ( this.props.renew && id > 0 ) this.props.renew();
		} else alert(data.message);
		}
		delNWin(this.props.winId);
			//console.log(id)	
	}

	name=() =>`Товар ${this.oldElmData.name}`;
	render() {
		if (!Object.hasOwn(this.oldElmData, 'id')) return;
		console.log(`Render sprElm ${this.props.elmId}`)
		return (           
		<WindowCl winId={this.props.winId} caption={this.name()} modal={false} key={this.props.winId}>
			<TabPanel>
				<TabItem title="Tab1">
					<form className="main">
        		<fieldset>
              <legend>Основные</legend>
                <table>
									<tbody>
                  <tr>
                    <td><SuperInput zagolovok="Наименование" value={this.oldElmData.name} onChange={(val) => this.changeData('name', val)}/></td>
										<td><SprInput zagolovok="OKSM" value={this.oldElmData.oksm}
											onBtnClick={() => addTWin(OKSMSpr, { onChoice: (elm: any) => this.changeData('oksm', elm) })}/></td>
                    <td><SprInput zagolovok="OKEI" value={this.oldElmData.okei}
											onBtnClick={() => addTWin(OKEISpr, { onChoice: (elm: any) => this.changeData('okei', elm) })}/></td>
										<td><SprInput zagolovok="NDS" value={this.oldElmData.nds}
											onBtnClick={() => addTWin(NDSSpr, { onChoice: (elm: any) => this.changeData('nds', elm) })}/></td>
									</tr>
									 <tr>
                    <td><SprInput zagolovok="Валюта учета" value={this.oldElmData.currency_accounting}
											onBtnClick={() => addTWin(CurrencySpr, { onChoice: (elm: any) => this.changeData('currency_accounting', elm) })}/></td>
                    <td><SprInput zagolovok="Валюта продаж" value={this.oldElmData.currency_sale}
											onBtnClick={() => addTWin(CurrencySpr, { onChoice: (elm: any) => this.changeData('currency_sale', elm) })}/></td>
										<td><SuperInput zagolovok="МинОст" value={this.oldElmData.minost} onChange={(val) => this.changeData('minost', val)}/></td>
										
									</tr>
									</tbody>
              	</table>
            </fieldset>
          </form>
				
			</TabItem>
			<TabItem title="Tab2">
				<h3>NewElm </h3>
				<span>Name </span>
			</TabItem>
			</TabPanel>
			<button onClick={this.dataSend}>OK</button>
			<button onClick={() => delNWin(this.props.winId)}>Отмена</button>
		</WindowCl>
	)
	}
}
	
