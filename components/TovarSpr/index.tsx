import React, { ReactComponentElement, useState, useEffect } from 'react'
import { Spr } from 'components/_proto/spr'; 
import { Tree, ITreeData, ITreeItem } from '../Tree'
import { WindowCl } from 'components/Window/winCl'
import { SprButtons } from '../SprButtons'
import { ItemTable } from '../ItemsTable'
import { TovarElm } from './elm';
import { TovarGrp } from './grp'
import { useWinStore, IComponentProps } from 'stores/wmStore'
//import { fetcher, useDataSend } from 'helpers/fetch';
//import shallow from 'zustand/shallow'
import styles from './styles'

const addWin = useWinStore.getState().addWin;

export type ITovarSprProps = {
  winId: number;
}

type ITovarSprState = {
  treeData: ITreeData;
  list: {id: number, name?: string}[];
}

export class TovarSpr extends Spr<ITovarSprProps, ITovarSprState> {
    
    constructor(props: ITovarSprProps) {
      super(props, '/api/spr/tovar');
      
    }

    async componentDidMount() {
      console.log(`Запуск основного класса`);
      super.loadData(this.apiPath);
    }

    onEditElm = (elmId: number) => {
      //console.log(elmId);
      addWin(TovarElm, {elmId: this.selectElmId, renew: this.onEndEditElm})
      //super.onEditElm(elmId, TovarElm);
    }

    onEditGrp = (elmId: number) => {
      super.onEditGrp(elmId, TovarGrp);
    }

    render() {
      console.log(`render TovarSpr ${this.props.winId}`)
      return (
               
        <WindowCl id={this.props.winId} caption='Товары' modal={false} key={this.props.winId} >    
          <div className="container">
            <div className='buttons'>
              <SprButtons 
                onNewFolder={()=> addWin(TovarGrp, {parentId: this.selectGrpId, renew: this.onEndEditGrp})}
                onNewElm={()=> addWin(TovarElm, {parentId: this.selectGrpId, renew: this.onEndEditElm})}
                />
            </div>
  
            <div className="tree">
            <Tree key={this.props.winId} {...this.state.treeData} ref={this.treeRef}
              onSelect={this.onSelectGrp}
              onEdit={this.onEditGrp}/>
            </div>
  
            <div className="table">
            <ItemTable tableKeys={{head:['Id1','Name','Path'], body:['id','name','path']}} tableData={this.state.list}
            onSelect={this.onSelectElm}
            onEdit={this.onEditElm}
            ref={this.itemRef}
            />
            </div>
          </div>
          <style jsx>{styles}</style>
        </WindowCl>
  
    )
    }
}
