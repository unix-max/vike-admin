import React from 'react'
import { trpc } from "@/trpc/client";
//import {Window, IWinProps} from '../Window'
import { useWinStore } from '../../../pages/+client'
import { WindowCl } from '../../Window/winCl'
import { TabPanel, TabItem} from '../../Tabs';
import { IClient, IClientCatalog } from '@/db/Entitys/Client';
import { SuperInput } from '../../inputs/SuperInput';
//import styles from './index.module.css'
const delNWin = useWinStore.getState().delNWin;

type IKlientElmProps  = {
	elmId?: number;
	parentId?: number;
	renew?: () => void;
}
type TWinId = IKlientElmProps & { winId: number }

type IClientElmState = {
	[key: string]: any
}
//const { data: elm, error: e1 } = useSWR(`/api/spr/client/elm/${props.elmId}`, fetcher);
export class KlientElm extends React.Component<TWinId, IClientElmState>{
	newElmData: IClientElmState;
	oldElmData: IClientElmState;
	path: string| null;

	constructor(props: TWinId) {
		super(props);
		this.newElmData = {};
		this.oldElmData = {};
		this.path = null; 
	}
	async componentDidMount() {
		console.log(this?.props?.parentId)
		if(this.props.elmId) {
			const data = await trpc.spr.client.getElm.query( {id: this.props.elmId});
			if (data) this.oldElmData = data.elm;
			console.log(data)
		} else {
			if (typeof(this?.props?.parentId)=='number' && this?.props?.parentId > 0) {
				//const {data} = await gClient({query: clientQuery, variables: {id: this.props.parentId}});
				//this.path = data?.clientById?.path;
				//console.log(this.path);
			}
			this.oldElmData = {id: 0, name: 'Новый'};
			this.newElmData = {id: 0, name: 'Новый'};
		}
		this.forceUpdate();

	}

	componentDidUpdate(prevProps: Readonly<IKlientElmProps>, prevState: Readonly<IClient>, snapshot?: any): void {
		// console.log(testTreeData===this.state.treeData)
		console.log(this.newElmData)
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
				data = await trpc.spr.client.insertElm.mutate({ id: this.props.elmId, ...this.newElmData });
			} else {
				data = await trpc.spr.client.insertElm.mutate({ parentId: this.props.parentId, type: 'E', ...this.newElmData });
			}
		} catch (e: any) {
			console.log(e);
		}
		if ('elm' in data) {
			const id =  data?.client?.id;
			if ( this.props.renew && id > 0 ) this.props.renew();
		} else alert(data.message);

		delNWin(this.props.winId);
		//console.log(id)	

	}
	name=() =>`Клиент ${this.oldElmData.name}`;
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
										<td><SuperInput zagolovok="Адрес" value={this.oldElmData.address} onChange={(val) => this.changeData('address', val)}/></td>
                    <td><SuperInput zagolovok="В документы" value={this.oldElmData.indoc} onChange={(val) => this.changeData('indoc', val)}/></td>      
                  </tr>
              	  <tr>
										<td><SuperInput zagolovok="ИНН" value={this.oldElmData.inn} onChange={(val) => this.changeData('inn', val)}/></td>
										<td><SuperInput zagolovok="КПП" value={this.oldElmData.kpp} onChange={(val) => this.changeData('kpp', val)}/></td>
                    <td><SuperInput zagolovok="ОГРН" value={this.oldElmData.ogrn} onChange={(val) => this.changeData('ogrn', val)}/></td> 
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
	
