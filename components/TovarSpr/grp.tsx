import React, { ReactComponentElement, useState, useEffect } from 'react'
import {Elm, IElmProps, IElmState } from 'components/_proto/elm';
import { WindowCl } from 'components/Window/winCl'
import { SuperInput } from 'components/SuperInput';
import { useWinStore } from 'stores/wmStore'
//import shallow from 'zustand/shallow'

const delWin = useWinStore.getState().delWin;


type ITovarGrpProps  = {
	winId: number;
	grpId?: number;
	parentId?: number| string;
	renew?: (id: number) => void;
}
export class TovarGrp extends React.Component<ITovarGrpProps>{
	newElmData: {[key: string]: any};

	constructor(props: ITovarGrpProps) {
		super(props);
		this.newElmData = {}
		this.state = {id: 0, name: 'Новый'};
	}
	render() {
		console.log(`Render sprGrp ${this.props.winId}`)
return (           
	<WindowCl id={this.props.winId} caption={this.state.name} modal={false}>
		<SuperInput zagolovok="Наименование" value={this.state.name} onChange={(val) => this.changeData('name', val)}/>
		<button onClick={this.dataSend}>OK</button>
		<button onClick={() => delWin(this.props.winId)}>Отмена</button>
	</WindowCl>
)
}
}