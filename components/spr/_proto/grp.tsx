import React, { ReactComponentElement, useState, useEffect } from 'react'
//import useSWR from 'swr'
//import {Window, IWinProps} from '../Window'
import { useWinStore } from '../../../pages/+client'
import { WindowCl } from '../../Window/winCl'
import { IClient, IClientCatalog } from '../../../db/Entitys/spr/Client';
import { SuperInput } from '../../inputs/SuperInput';
import { fetcher, useDataSend } from '../../../helpers/fetch';
//import styles from './index.module.css'
const delWin = useWinStore.getState().delWin;

export type IGrpProps  = {
	winId: number;
	grpId?: number;
	parentId?: number| string;
	renew?: (id: number) => void;
}

export type IGrpState  = {
	[key: string]: any;

}
export class Grp<P extends IGrpProps, S extends IGrpState>
			extends React.Component<IGrpProps, IGrpState> {

	newElmData: IGrpState;
	oldElmData: IGrpState;

	constructor( props: P)  {
		super(props);
		this.newElmData = {};
		this.oldElmData = {};

		this.dataLoad = this.dataLoad.bind(this);
		this.dataChange = this.dataChange.bind(this);
		this.dataSend = this.dataSend.bind(this);
	}

async dataLoad(apiPath: string) {
	if(this.props.elmId) {
		const elmJson = await fetcher(`${apiPath}/elm/${this.props.elmId}`);
		
		this.oldElmData = elmJson.elm;
		console.log( this.oldElmData)
	} else {
		this.oldElmData = {id: 0, name: 'Новый'};
		this.newElmData = {id: 0, name: 'Новый'};
	}
	this.forceUpdate();
}

componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: any): void {
 // console.log(testTreeData===this.state.treeData)
 // testTreeData = this.state.treeData;
}
shouldComponentUpdate(nextProps: P, nextState: S) {
	//console.log(nextState.treeData===this.state.treeData)
	return true;
}
dataChange(key: string, val: any) {
	this.oldElmData[key] = val;
	this.newElmData[key] = val;
	//this.setState( {[key]: val})
	//console.log(this.newElmData);
	if (key=='name') this.forceUpdate();
 }

async dataSend(apiPath: string) {
	const { id } = await useDataSend(this.newElmData, {url:`${apiPath}/elm`, id:this.oldElmData.id, parentId:this.props.parentId, type:'E'});
	if(this.props.renew) this.props.renew(id);
	delWin(this.props.winId);
	//console.log(id)	
 }

 
}

	
}