import React from 'react'
import { trpc } from "@/trpc/client";
import { useWinStore } from '@/pages/+client'
import { WindowCl } from '../../Window/winCl'
import { SuperInput } from '../../inputs/SuperInput';

//import styles from './index.module.css'
const delNWin = useWinStore.getState().delNWin;

type ITovarGrpProps  = {
	grpId?: number;
	parentId?: number;
	renew?: (id: number) => void;
}
type TWinId = ITovarGrpProps & { winId: number }

type ITovarGrpState  = {
	[key: string]: any;
	id: number;
	name: string;
}

export class TovarGrp extends React.Component<TWinId, ITovarGrpState>{
	newGrpData: {[key: string]: any};
	path: string| null;

	constructor(props: TWinId) {
		super(props);
		this.newGrpData = {}
		this.state = {id: 0, name: 'Новый'};
		this.path = null; 
	}
	async componentDidMount() {
		if(this.props.grpId) {
			const data = await trpc.spr.client.getElm.query({tName:'tovar', tData:['name'], id: this.props.grpId});
			if (data) this.setState({id: data.elm.id, name: data.elm.name});
			console.log(data)
			
		} else {
			if (typeof(this?.props?.parentId)=='number' && this?.props?.parentId > 0) {
				//console.log(this.path);
				this.newGrpData.name = 'Новый';
			}
			
		}
	}

	changeData= (key: string, val: any) => {
		this.newGrpData[key] = val;
		this.setState( {[key]: val})
		//console.log(val)
	}
	
	dataSend= async () => {
		//let id: number = 0;
		let data: any;
		try {
			if (this.props.grpId) {
				data = await trpc.spr.client.insertElm.mutate({ tName: 'tovar', tData: { id: this.props.grpId, ...this.newGrpData }});
			} else {
				data = await trpc.spr.client.insertElm.mutate({ tName: 'tovar', tData: { parentId: this.props.parentId, type: 'F', ...this.newGrpData }});
			}
		} catch (e: any) {
			console.log(e);
		}
		if ('client' in data) {
			const id =  data?.client?.id;
			if ( this.props.renew && id > 0 ) this.props.renew(id);
		} else alert(data.message);

		delNWin(this.props.winId);
		//console.log(id)	
	}

	render() {
			console.log(`Render sprGrp ${this.state.name}`)
	return (           
		<WindowCl winId={this.props.winId} caption={this.state.name} modal={false} key={this.props.winId}>
			<SuperInput zagolovok="Наименование" value={this.state.name} onChange={(val) => this.changeData('name', val)}/>
			<button onClick={this.dataSend}>OK</button>
			<button onClick={() => delNWin(this.props.winId)}>Отмена</button>
		</WindowCl>
	)
}

}