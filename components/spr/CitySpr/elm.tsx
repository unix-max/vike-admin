import React from 'react'
import { trpc } from "@/trpc/client";
//import {Window, IWinProps} from '../Window'
import { useWinStore } from '@/pages/+client'
import { WindowCl } from '../../Window/winCl'
import { TabPanel, TabItem} from '../../Tabs';
import { ICity } from '@/db/Entitys/City';
import { SuperInput } from '../../inputs/SuperInput';
//import styles from './index.module.css'
const delNWin = useWinStore.getState().delNWin;

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
	path: string| null;

	constructor(props: ICityElmProps) {
		super(props);
		this.newElmData = {};
		this.oldElmData = {};
		this.path = null; 
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

	componentDidUpdate(prevProps: Readonly<ICityElmProps>, prevState: Readonly<ICity>, snapshot?: any): void {
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
		<WindowCl winId={this.props.winId} caption={this.oldElmData.name} modal={false}>
			<form className="main">
        		<fieldset>
              <legend>Основные</legend>
                <table>
									<tbody>
                  <tr>
                    <td><SuperInput zagolovok="Наименование" value={this.oldElmData.name} onChange={(val) => this.changeData('name', val)}/></td>
										<td><SuperInput zagolovok="Полное наименование" value={this.oldElmData.fullname} onChange={(val) => this.changeData('fullname', val)}/></td>
										<td><SuperInput zagolovok="OKSM" value={this.oldElmData.oksm} onChange={(val) => this.changeData('oksm', val)}/></td>
                        
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
	
