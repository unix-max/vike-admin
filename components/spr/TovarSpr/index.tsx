import React from 'react'
import { trpc } from "@/trpc/client";
import { Tree, ITreeData, ITreeItem } from '../../Tree'
import { WindowCl } from '../../Window/winCl'
import { SprButtons } from '../../SprButtons'
import { ItemTable } from '../../ItemsTable'
import { TovarElm } from './elm';
import { TovarGrp } from './grp'
import { useWinStore } from '@/pages/+client'
import { ITovar} from '@/db/Entitys/Tovar'
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
  list: ITovar[];
}

export class TovarSpr extends React.Component<IKlientSprProps, IKlientSprState>{
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

    const  data = await trpc.spr.client.getList.query({tName:'tovar', tData:['name'], id: 0});
    const  treeJson = await trpc.spr.client.getTree.query({tName: 'tovar'});
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
  onEditElm = (elm: ITovar) => {
    //console.log(elmId)
    if (elm.type == 'F') {
      addNWin(TovarGrp, {winId: Date.now(), grpId: this.selectElmId, renew: this.reloadTree});
    } else {
      addNWin(TovarElm, {winId: Date.now() ,elmId: this.selectElmId, renew: this.reloadList});
    }
  }
  reloadList = async () => {
    const  data = await trpc.spr.client.getList.query({tName:'tovar', tData:['name'], id: this.selectGrpId} );
    console.log(data)
    if (data) this.setState({ list: data.list });
  }

  onSelectGrp = async (grpId: number) => {
    console.log(grpId)
    this.selectGrpId = grpId;
    this.treeRef.current?.selectItem(grpId);
    this.reloadList();
  }
  name() {
    return 'Товары';
  }
  onEditGrp = (grpId: number) => {
    //console.log(grpId)
    addNWin(TovarGrp, {winId: Date.now(), grpId: this.selectGrpId, renew: this.reloadTree})
  }
  reloadTree = async (grpId: number) => {
    const  treeJson = await trpc.spr.client.getTree.query({tName: 'tovar'});
    if (treeJson ) this.setState({ treeData: treeJson });
  }
  
  render() {
    console.log(`render KlientSpr ${this.props.id}`)
    return (
             
      <WindowCl winId={this.props.winId} caption='Товары' modal={false} key={this.props.id} >    
        <div className="container">
          <div className='buttons'>
            <SprButtons 
              onNewFolder={()=> addNWin(TovarGrp, {winId: Date.now(), parentId: this.selectGrpId, renew: this.reloadTree})}
              onNewElm={()=> addNWin(TovarElm, {winId: Date.now(), parentId: this.selectGrpId, renew: this.reloadList})}
              />
          </div>

          <div className="tree">
          <Tree key={this.props.id} {...this.state.treeData} ref={this.treeRef}
            onSelect={this.onSelectGrp}
            onEdit={this.onEditGrp}/>
          </div>

          <div className="table">
          <ItemTable tableKeys={{head:['Id','Name', 'Path'], body:['id','name', 'path']}} tableData={this.state.list}
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