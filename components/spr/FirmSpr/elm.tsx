import React from 'react'
import { trpc } from "@/trpc/client";
//import {Window, IWinProps} from '../Window'
import { useWinStore } from '@/pages/+client'
import { WindowCl } from '../../Window/winCl'
import { TabPanel, TabItem} from '../../Tabs';
import { IFirm } from '@/db/Entitys/Firm'; 
import { SuperInput } from '../../inputs/SuperInput';		
import { FirmAccSpr } from './accList';

//import styles from './index.module.css'
const delNWin = useWinStore.getState().delNWin;

type IFirmElmProps  = {
	elmId?: number;
	renew?: () => void;
}
type TWinId = IFirmElmProps & { winId: number }

type IFirmElmState = {
	[key: string]: any
}

export class FirmElm extends React.Component<TWinId, IFirmElmState>{
	newElmData: IFirmElmState;
	oldElmData: IFirmElmState;

	constructor(props: TWinId) {
		super(props);
		this.newElmData = {};
		this.oldElmData = {};

	}
	
	async componentDidMount() {
		this.reload();
	}

 reload = async () => {
	if(this.props.elmId) {
			const data = await trpc.spr.firm.getElm.query({ firmId: this.props.elmId});
			if (data) this.oldElmData = data.elm as IFirm;
		} else {	
			this.oldElmData = {id: 0, name: 'Новый'};
			this.newElmData = {id: 0, name: 'Новый'};
		}
		this.forceUpdate();
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
					data = await trpc.spr.firm.setElm.mutate({ id: this.props.elmId, ...this.newElmData });
				} else {
					data = await trpc.spr.firm.setElm.mutate({ ...this.newElmData });
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

	name=() =>`Фирма ${this.oldElmData.name}`;
	render() {
		if (!Object.hasOwn(this.oldElmData, 'id')) return;
		console.log(`Render sprElm ${this.props.elmId}`)
		return (           
		<WindowCl winId={this.props.winId} caption={this.name()} modal={false} key={this.props.winId}>
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
										<td>
											<label>Тип учета</label><br/>
											<select 
												onChange={e => this.changeData('tax_sys', e.target.value)}
												value={this.oldElmData.tax_sys ? this.oldElmData.tax_sys : ""}
												>
													<option value="osno">ОСНО</option>
													<option value="usn6">УСН 6</option>
													<option value="usn15">УСН 15</option>
											</select>
										</td>
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
			<TabItem title="Счета" >
				<FirmAccSpr 
					firmId={this.props.elmId}
					mainAcc={this.oldElmData.main_acc}
					renew={this.reload}/>
			</TabItem>
			</TabPanel>
			<button onClick={this.dataSend}>OK</button>
			<button onClick={() => delNWin(this.props.winId)}>Отмена</button>
		</WindowCl>
	)
	}
}
	
