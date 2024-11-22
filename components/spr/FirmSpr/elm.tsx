import React from 'react'
import { trpc } from "@/trpc/client";
//import {Window, IWinProps} from '../Window'
import { useWinStore } from '@/pages/+client'
import { WindowCl } from '../../Window/winCl'
import { TabPanel, TabItem} from '../../Tabs';
import { IFirm } from '@/db/Entitys/Firm'; 
import { SuperInput, BtnInput, CheckInput } from '@/components/inputs';
import { ItemTable } from '@/components/ItemsTable';
//import styles from './index.module.css'
const delNWin = useWinStore.getState().delNWin;

type IFirmElmProps  = {
	winId: number;
	elmId?: number;
	renew?: () => void;
}

type IFirmElmState = {
	[key: string]: any
}

export class FirmElm extends React.Component<IFirmElmProps, IFirmElmState>{
	newElmData: IFirmElmState;
	oldElmData: IFirmElmState;
	state: IFirmElmState;

	constructor(props: IFirmElmProps) {
		super(props);
		this.newElmData = {};
		this.oldElmData = {};
		this.state = {}; 
	}
	async componentDidMount() {
	
		if(this.props.elmId) {
			const data = await trpc.spr.firm.getElm.query({ firmId: this.props.elmId});
			if (data) this.oldElmData = data.elm;
		} else {	
			this.oldElmData = {id: 0, name: 'Новый'};
			this.newElmData = {id: 0, name: 'Новый'};
		}
		this.forceUpdate();
	}

	loadAccs = async () => {
		if(this.props.elmId) {
			const data = await trpc.spr.firmAcc.getList.query({ firmId: this.props.elmId});
			console.log(data)
			this.setState({ accs: data?.list })
		}
	}
	onOpenAccs = () => {
		if(!this.state.accs) this.loadAccs();
	}

	componentDidUpdate(prevProps: Readonly<IFirmElmProps>, prevState: Readonly<IFirm>, snapshot?: any): void {
		// console.log(testTreeData===this.state.treeData)
		//console.log(this.newElmData)
	 }
	 /*getData=(key: string) => {
		//console.log(this.state[key])
		if (this.newElmData[key]) return this.newElmData[key];
		return this.state[key]
	 } */
	changeData= (key: string, val: any) => {
		this.oldElmData[key] = val;
		this.newElmData[key] = val;
		//this.setState( {[key]: val})
		//console.log(this.newElmData);
		//if (key=='name')
		this.forceUpdate();
	}

	dataSend= async () => {
		let data: any;
		try {
			if (this.props.elmId) {
				data = await trpc.spr.client.insertElm.mutate({ tName: 'tovar', tData: { id: this.props.elmId, ...this.newElmData }});
			} else {
				data = await trpc.spr.client.insertElm.mutate({ tName: 'tovar', tData: { type: 'E', ...this.newElmData }});
			}
		} catch (e: any) {
			console.log(e);
		}
		if ('client' in data) {
			const id =  data?.client?.id;
			if ( this.props.renew && id > 0 ) this.props.renew();
		} else alert(data.message);

		delNWin(this.props.winId);
		//console.log(id)	

	}

	render() {
		if (!Object.hasOwn(this.oldElmData, 'id')) return;
		console.log(`Render sprElm ${this.props.elmId}`)
		return (           
		<WindowCl winId={this.props.winId} caption={this.oldElmData.name} modal={false} key={this.props.winId}>
			<TabPanel>
				<TabItem title="Основной">
					<form className="main">
        		<fieldset>
              <legend>Основные</legend>
                <table>
									<tbody>
                  <tr>
                    <td><SuperInput zagolovok="Наименование" value={this.oldElmData.name} onChange={(val) => this.changeData('name', val)}/></td>
										<td><SuperInput zagolovok="ИНН" value={this.oldElmData.inn} onChange={(val) => this.changeData('inn', val)}/></td>
                    <td><SuperInput zagolovok="КПП" value={this.oldElmData.kpp} onChange={(val) => this.changeData('kpp', val)}/></td>      
                  </tr>
									<tr>
										<td><SuperInput zagolovok="В Документы" value={this.oldElmData.indoc} onChange={(val) => this.changeData('indoc', val)}/></td>
										<td><SuperInput zagolovok="ОГРН" value={this.oldElmData.ogrn} onChange={(val) => this.changeData('ogrn', val)}/></td>
										<td><CheckInput zagolovok="Плательщик НДС" value={this.oldElmData.ogrn} onChange={(val) => this.changeData('nds', val)}/></td>
									</tr>
									<tr>
										<td colSpan={3}><SuperInput zagolovok="Адрес" value={this.oldElmData.address} onChange={(val) => this.changeData('address', val)}/></td>
									</tr>
									<tr>
										<td colSpan={3}><SuperInput zagolovok="Юр.Адрес" value={this.oldElmData.uraddress} onChange={(val) => this.changeData('uraddress', val)}/></td>
										
										
									</tr>
									
									</tbody>
              	</table>
            </fieldset>
          </form>
				
			</TabItem>
			<TabItem title="Счета" onSelect={this.onOpenAccs}>
			<ItemTable tableKeys={{head:['Id','Name', 'number', 'Валюта', 'Банк'], body:['id','name', 'number', 'currency', 'bank']}}  tableData={this.state.accs}
			  
          />
			</TabItem>
			</TabPanel>
			<button onClick={this.dataSend}>OK</button>
			<button onClick={() => delNWin(this.props.winId)}>Отмена</button>
		</WindowCl>
	)
	}
}
	
