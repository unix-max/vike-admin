import React, { ReactComponentElement, useState, useEffect } from 'react'
import { Tree, ITreeData, ITreeItem } from '../Tree'
import { WindowCl } from '../Window/winCl'
import { SprButtons } from '../SprButtons'
import { ItemTable } from '../ItemsTable'
//import { Elm } from './elm';
//import { TovarGrp } from './grp'
import { useWinStore, IComponentProps } from '../../pages/+client'
import { fetcher, useDataSend } from '../../helpers/fetch';
//import shallow from 'zustand/shallow'

const addWin = useWinStore.getState().addNWin;

export type ISprProps = {
  winId: number;
}

type ISprState = {
  treeData: ITreeData;
  list: {id: number, name?: string}[];
}


export class Spr<P extends ISprProps, S extends ISprState> 
    extends React.Component<ISprProps, ISprState> {

  apiPath:string;
  selectElmId?: number;
  selectGrpId?: number | string = 'null';
  treeRef: React.RefObject<Tree>;
  itemRef: React.RefObject<ItemTable>;
  //  Elm: React.ComponentType<IComponentProps>;
  //  Grp: React.ComponentType<IComponentProps>;

    constructor(
          props: P, apiPath:string
        //  elm: React.ComponentType<IComponentProps>,
        //  grp : React.ComponentType<IComponentProps>
        )  {

      super(props);
      this.treeRef = React.createRef();
      this.itemRef = React.createRef();
      this.apiPath = apiPath;
    //  this.Elm = elm;
    //  this.Grp = grp;
      this.state = {
        treeData: { name: 'Name'},
        list: [{id: 0, name: 'Name'}]
     }
    }
  
  // async loadData(apiPath: string) {
  //   const  treeJson = await fetcher(`${apiPath}/tree`);
  //   const  itemsJson = await fetcher(`${apiPath}/list/null`);
  //   this.setState({ treeData: treeJson, list: itemsJson.list });
  //   this.treeRef.current?.selectItem('null');
  // }
  // componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: any): void {
  //  // console.log(testTreeData===this.state.treeData)
  //  // testTreeData = this.state.treeData;
  // }
  // shouldComponentUpdate(nextProps: P, nextState: S) {
  //   //console.log(nextState.treeData===this.state.treeData)
  //   return true;
  // }
  // onSelectElm = (elmId: number) => {
  //   //console.log(elmId);
  //   this.selectElmId = elmId;
  //   this.itemRef.current?.selectItem(elmId);

  // }
  // onEditElm = (elmId: number, elm1: React.ComponentType<IComponentProps>) => {
  //   console.log(123)
  //   addWin(elm1, {elmId: this.selectElmId, renew: this.onEndEditElm})
  // }
  // onEndEditElm = async (elmId: number) => {
  //   const  itemsJson = await fetcher(`${this.apiPath}/list/${this.selectGrpId}`);
  //   this.setState({ list: itemsJson.list });
  // }

  // onSelectGrp = async (grpId: number) => {
  //   this.selectGrpId = grpId;
  //   this.treeRef.current?.selectItem(grpId);
  //   const  itemsJson = await fetcher(`${this.apiPath}/list/${grpId}`);
  //   this.setState({ list: itemsJson.list });
  //   //console.log(this.treeRef.current);
    
  // }
  // onEditGrp = (grpId: number,  Grp: React.ComponentType<IComponentProps>) => {
  //   //console.log(grpId)
  //   addWin(Grp, {grpId: this.selectGrpId, renew: this.onEndEditGrp})
  // }
  // onEndEditGrp = async (grpId: number) => {
  //   const  treeJson = await fetcher(`${this.apiPath}tree`);
  //   this.setState({ treeData: treeJson });
  // }
  

}