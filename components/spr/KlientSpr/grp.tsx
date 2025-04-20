import React from 'react'
import { trpc } from "@/trpc/client";
import { useWinStore } from '@/pages/+client'
import { WindowCl } from '../../Window/winCl'
import { SuperInput } from '../../inputs/SuperInput';

//import styles from './index.module.css'
const delNWin = useWinStore.getState().delNWin;

type IKlientGrpProps  = {
	grpId?: number;
	parentId?: number;
	renew?: (id: number) => void;
}
type TWinId = IKlientGrpProps & { winId: number }

type IKlientGrpState  = {
	[key: string]: any;
	
}

export class KlientGrp extends React.Component<TWinId, IKlientGrpState>{
	oldGrpData: IKlientGrpState;
	newGrpData: IKlientGrpState;
	path: string| null;

	constructor(props: TWinId) {
		super(props);
		this.oldGrpData = {}
		this.newGrpData = {}
		this.path = null; 
	}
	async componentDidMount() {
		if(this.props.grpId) {
			const data = await trpc.spr.client.getElm.query({id: this.props.grpId});
			if (data) this.oldGrpData = data.elm;
			console.log(data)
			
		} else {
			if (typeof(this?.props?.parentId)=='number' && this?.props?.parentId > 0) {
				//console.log(this.path);
				this.oldGrpData = {id: 0, name: 'Новый'};
				this.newGrpData = {id: 0, name: 'Новый'};
				//this.newGrpData.name = 'Новый';
			}
		}
		this.forceUpdate();
	}

	changeData= (key: string, val: any) => {
		this.oldGrpData[key] = val;
		this.newGrpData[key] = val;
		//this.setState( {[key]: val})
		//console.log(this.newElmData);
		//if (key=='name')
		this.forceUpdate();
	}
	
	dataSend= async () => {
		//let id: number = 0;
		let data: any;
		try {
			if (this.props.grpId) {
				data = await trpc.spr.client.insertElm.mutate({ id: this.props.grpId, ...this.newGrpData });
			} else {
				data = await trpc.spr.client.insertElm.mutate({ parentId: this.props.parentId, type: 'F', ...this.newGrpData });
			}
		} catch (e: any) {
			console.log(e);
		}
		if ('elm' in data) {
			const id =  data?.elm?.id;
			if ( this.props.renew && id > 0 ) this.props.renew(id);
		} else alert(data.message);

		delNWin(this.props.winId);
		//console.log(id)	
	}
	name=() =>`Клиент ${this.oldGrpData.name}`;
	render() {
			console.log(`Render sprGrp ${this.oldGrpData.name}`)
	return (           
		<WindowCl winId={this.props.winId} caption={this.oldGrpData.name} modal={false} key={this.props.winId}>
			<SuperInput zagolovok="Наименование" value={this.oldGrpData.name} onChange={(val) => this.changeData('name', val)}/>
			<button onClick={this.dataSend}>OK</button>
			<button onClick={() => delNWin(this.props.winId)}>Отмена</button>
		</WindowCl>
	)
}

}