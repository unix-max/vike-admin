import React from 'react'
import { trpc } from "@/trpc/client";
//import {Window, IWinProps} from '../Window'
import { useWinStore } from '@/pages/+client'
import { WindowCl } from '../../Window/winCl'
import { TabPanel, TabItem} from '../../Tabs';
import { ITovar } from '@/db/Entitys/Tovar';
import { SuperInput } from '../../inputs/SuperInput';
//import styles from './index.module.css'
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
		console.log(this?.props?.parentId)
		if(this.props.elmId) {
			const data = await trpc.spr.client.getElm.query({tName:'tovar', tData:['name','oksm', 'okei'], id: this.props.elmId});
			if (data) this.oldElmData = data.elm;
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
				data = await trpc.spr.client.insertElm.mutate({ tName: 'tovar', tData: { parentId: this.props.parentId, type: 'E', ...this.newElmData }});
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
										<td><SuperInput zagolovok="OKSM" value={this.oldElmData.oksm} onChange={(val) => this.changeData('oksm', val)}/></td>
                    <td><SuperInput zagolovok="OKEI" value={this.oldElmData.okei} onChange={(val) => this.changeData('okei', val)}/></td>      
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
	
