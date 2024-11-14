import React, { ReactComponentElement, useState, useEffect } from 'react'
import { trpc } from "@/trpc/client";
import { Tree, ITreeData, ITreeItem } from '../Tree'
//import {Window, IWinProps} from '../Window'
import { WindowCl } from '../Window/winCl'
import { SprButtons } from '../SprButtons'
import { ItemTable } from '../ItemsTable'
import { KlientElm } from './elm';
import { KlientGrp } from './grp'
import { useWinStore } from '@/pages/+client'
import { IClient, IClientCatalog } from '../../db/Entitys/Client'
//import shallow from 'zustand/shallow'
import styles from './styles'
//console.log(styles)
const addNWin = useWinStore.getState().addNWin;

export type IKlientSprProps = {
  winId: number;
  id?: number;
}

type IKlientSprState = {
  treeData: ITreeData;
  list: IClient[];
}

export class KlientSpr extends React.Component<IKlientSprProps, IKlientSprState>{
  selectElmId?: number;
  selectGrpId: number;
  treeRef: React.RefObject<Tree>;
  itemRef: React.RefObject<ItemTable>;

  constructor(props: IKlientSprProps) {
    super(props);
    this.treeRef = React.createRef();
    this.itemRef = React.createRef();
    this.selectGrpId = 0;
    this.state = {
      treeData: {name: "New Tree"},
      list: [{id: 0, }]
   }
   console.log(`Constructor KlientSpr ${this.props.id}`)
   this.name = this.name.bind(this);
  }
  async componentDidMount() {
    //console.log(initRequest)

    const  data = await trpc.spr.client.getList.query({tName:'client', tData:['name','phone'], id: 0});
    const  treeJson = await trpc.spr.client.getTree.query({tName: 'client'});
    //console.log(treeJson)
    if (treeJson && data) this.setState({ treeData: treeJson, list: data.list });
    
    //const thiDate = await trpc.demo.query(10);
    console.log(data)
    this.treeRef.current?.selectItem(0);
  }
  componentDidUpdate(prevProps: Readonly<IKlientSprProps>, prevState: Readonly<IKlientSprState>, snapshot?: any): void {
   // console.log(testTreeData===this.state.treeData)
   // testTreeData = this.state.treeData;
  }
  shouldComponentUpdate(nextProps: IKlientSprProps, nextState: IKlientSprState) {
    //console.log(nextState.treeData===this.state.treeData)
    return true;
  }
  onSelectElm = (elmId: number) => {
    //console.log(elmId+110);
    this.selectElmId = elmId;
    this.itemRef.current?.selectItem(elmId);

  }
  onEditElm = (elm: IClient) => {
    //console.log(elmId)
    if (elm.type == 'F') {
      addNWin(KlientGrp, {winId: Date.now(), grpId: this.selectElmId, renew: this.reloadTree});
    } else {
      addNWin(KlientElm, {winId: Date.now() ,elmId: this.selectElmId, renew: this.reloadList});
    }
  }
  reloadList = async () => {
    const  data = await trpc.spr.client.getList.query({tName:'client', tData:['name','phone'], id: this.selectGrpId});
    //console.log(data)
    if (data) this.setState({ list: data.list });
  }

  onSelectGrp = async (grpId: number) => {
    this.selectGrpId = grpId;
    this.treeRef.current?.selectItem(grpId);
    this.reloadList();
  }
  name() {
    return 'Клиенты';
  }
  onEditGrp = (grpId: number) => {
    //console.log(grpId)
    addNWin(KlientGrp, {winId: Date.now(), grpId: this.selectGrpId, renew: this.reloadTree})
  }
  reloadTree = async (grpId: number) => {
    const  treeJson = await trpc.spr.client.getTree.query({tName: 'client'});
    if (treeJson ) this.setState({ treeData: treeJson });
  }
  
  render() {
    console.log(`render KlientSpr ${this.props.id}`)
    return (
             
      <WindowCl winId={this.props.winId} caption='Клиенты' modal={false} key={this.props.id} >    
        <div className="container">
          <div className='buttons'>
            <SprButtons 
              onNewFolder={()=> addNWin(KlientGrp, {winId: Date.now(), parentId: this.selectGrpId, renew: this.reloadTree})}
              onNewElm={()=> addNWin(KlientElm, {winId: Date.now(), parentId: this.selectGrpId, renew: this.reloadList})}
              />
          </div>

          <div className="tree">
          <Tree key={this.props.id} {...this.state.treeData} ref={this.treeRef}
            onSelect={this.onSelectGrp}
            onEdit={this.onEditGrp}/>
          </div>

          <div className="table">
          <ItemTable tableKeys={{head:['Id1','Name','Тел','Path'], body:['id','name','phone','path']}} tableData={this.state.list}
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

/*
export function KlientSpr(props: {id: number}) {
  console.log(`Render KlientSpr ${props.id}`);
  const addWin = useWinStore((state: any)  => state.addWin, shallow);
  const [selectElmId, setSelectElmId] = useState(0);
  //const [list, setList] = useState({list:[]});
  //let list: any = []
  const { data: treeData, error: e1 } = useSWR('/api/spr/client/tree', fetcher);
  const { data: list, error: e2 } = useSWR('/api/spr/client/list/29', fetcher);
  console.log(selectElmId)
  /* useEffect(() => {
    fetch('/api/spr/client/list', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({id:29}),
  })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setList(data)
        //list = data
        
      })
  }, [])
  */

  /*
  let treeRef: Tree |null;
  const onSelectElm = (elmId: number) => {
    console.log(elmId);
    setSelectElmId(elmId);

  }
  const onEditElm = (elmId: number) => {
    console.log(elmId)
    addWin(KlientElm, {elmId: elmId})
  }
  const onSelectGrp = (id: number) => {
    
  }
  return (
             
      <WindowCl id={props.id} caption='Клиенты' modal={false} key={props.id} >    
        <div className="container">
          <div className='buttons'>
            <SprButtons 
              onNewFolder={(ev)=> console.log(ev)}
              onNewElm={()=> addWin(KlientElm, {})}
              />
          </div>
          <div className="tree">
          <Tree {...treeData} ref={(elm)=> treeRef=elm}/>
          <button onClick={() => treeRef?.selectItem(29)}>kkk</button>
          </div>
          <div className="table">
        
          <ItemTable tableKeys={{head:['Id1','Name','Path'], body:['id','name','path']}} tableData={list?.list}
          onSelect={onSelectElm}
          onEdit={onEditElm}
          selectId={selectElmId} 
          />
          
          </div>
        </div>
        <style jsx>{styles}</style>
      </WindowCl>

  )
}
*/


