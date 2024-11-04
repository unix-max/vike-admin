import React, { ReactComponentElement, useState, useEffect } from 'react'
import {Elm, IElmProps, IElmState } from 'components/_proto/elm';
import { WindowCl } from 'components/Window/winCl'
import { SuperInput } from 'components/SuperInput';
import { useWinStore } from 'stores/wmStore'


const delWin = useWinStore.getState().delWin;

type ITovarElmProps = IElmProps & {
	//winId: number;
	//elmId?: number;
	//parentId?: number | string;
	//renew?: (id: number) => void;
}
type ITovarElmState = IElmState & {
	//[key: string]: any;
}
export class TovarElm extends Elm<ITovarElmProps, ITovarElmState>{
	apiPath:string;

	constructor(props: ITovarElmProps) {
		super(props);
		this.apiPath = '/api/spr/tovar';

		this.componentDidMount = this.componentDidMount.bind(this);
		this.dataSend = this.dataSend.bind(this);
	}

	async componentDidMount() {
		super.dataLoad(this.apiPath);
	}
	async dataSend() {
		//console.log(super)
		super.dataSend(this.apiPath);
	}


	render() {
		if (!Object.hasOwn(this.oldElmData, 'id')) return;
		console.log(`Render sprElm ${this.props.winId}`)
		return (           
		<WindowCl id={this.props.winId} caption={this.oldElmData.name} modal={false}>
		
		<form className="main">
        		<fieldset>
              <legend>Основные</legend>
                <table>
									<tbody>
                  <tr>
                    <td><SuperInput zagolovok="Наименование" value={this.oldElmData.name} onChange={(val) => this.dataChange('name', val)}/></td>
										<td><SuperInput zagolovok="Адрес" value={this.oldElmData.okei} onChange={(val) => this.dataChange('okei', val)}/></td>
                    <td><SuperInput zagolovok="В документы" value={this.oldElmData.oksm} onChange={(val) => this.dataChange('oksm', val)}/></td>      
                  </tr>
              	 
									</tbody>
              	</table>
            </fieldset>
          </form>
				
		

			<button onClick={this.dataSend}>OK</button>
			<button onClick={() => delWin(this.props.winId)}>Отмена</button>
		</WindowCl>
	)
	}

}