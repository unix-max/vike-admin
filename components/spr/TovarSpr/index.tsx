import React from 'react'
import { trpc } from "@/trpc/client";
import { Tree, ITreeData, ITreeItem } from '../../Tree'
import { WindowCl } from '../../Window/winCl'
import { SprButtons } from '../../SprButtons'
import { ItemTable } from '../../ItemsTable1'
import { TovarElm } from './elm';
import { TovarGrp } from './grp'
import { useWinStore } from '@/pages/+client'
import { ITovar} from '@/db/Entitys/spr/Tovar'
//import shallow from 'zustand/shallow'
import styles from './styles'
//console.log(styles)
const addTWin = useWinStore.getState().addTWin;

export type ITovarSprProps = {
  id?: number;
  onChoice?: (elm:ITovar) => void;
}

type TWinId = ITovarSprProps & { winId: number }

type ITovarSprState = {
  treeData: ITreeData;
  list: ITovar[];
}

export class TovarSpr extends React.Component<TWinId, ITovarSprState>{
  selectElmId?: number;
  selectGrpId: number;
  treeRef: React.RefObject<Tree>;
  itemRef: React.RefObject<ItemTable<ITovar>>;

  constructor(props: TWinId) {
    super(props);
    this.treeRef = React.createRef();
    this.itemRef = React.createRef();
    this.selectGrpId = 0;
    this.state = {
      treeData: {name: "New Tree"},
      list: [{id: 0, }]
  }
  console.log(`Constructor TovarSpr ${this.props.id}`)
  this.name = this.name.bind(this);
  }
  async componentDidMount() {
    //console.log(initRequest)

    const  data = await trpc.spr.tovar.getList.query({tName:'tovar', tData:['name'], id: 0});
    const  treeJson = await trpc.spr.tovar.getTree.query();
    if (treeJson && data) this.setState({ treeData: treeJson, list: data.list });
    
    //const thiDate = await trpc.demo.query(10);
    console.log(data)
    this.treeRef.current?.selectItem(0);
  }
  componentDidUpdate(prevProps: Readonly<ITovarSprProps>, prevState: Readonly<ITovarSprState>, snapshot?: any): void {
   // console.log(testTreeData===this.state.treeData)
   // testTreeData = this.state.treeData;
  }
  shouldComponentUpdate(nextProps: ITovarSprProps, nextState: ITovarSprState) {
    //console.log(nextState.treeData===this.state.treeData)
    return true;
  }
  onSelectElm = (item: ITovar) => {
    //console.log(elmId+110);
    this.selectElmId = item.id;
    this.itemRef.current?.selectItem(this.selectElmId );

  }
  onEditElm = (elm: ITovar) => {
    //console.log(elmId)
    if (elm.type == 'F') {
      addTWin(TovarGrp, { grpId: this.selectElmId, renew: this.reloadTree});
    } else {
      addTWin(TovarElm, { elmId: this.selectElmId, renew: this.reloadList});
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
    addTWin(TovarGrp, {grpId: this.selectGrpId, renew: this.reloadTree})
  }
  reloadTree = async (grpId: number) => {
    const  treeJson = await trpc.spr.client.getTree.query({tName: 'tovar'});
    if (treeJson ) this.setState({ treeData: treeJson });
  }
   onLoadTable = async () => {
      let a = await trpc.spr.tovar.loadTable.query()
    }
  
  render() {
    console.log(`render TovarSpr ${this.props.id}`)
    return (

      <WindowCl winId={this.props.winId} caption='Товары' modal={false} key={this.props.winId}>    
        <div className="container">
          <div className='buttons'>
            <SprButtons 
              onNewFolder={()=> addTWin(TovarGrp, {parentId: this.selectGrpId, renew: this.reloadTree})}
              onNewElm={()=> addTWin(TovarElm, {parentId: this.selectGrpId, renew: this.reloadList})}
              />
          </div>

          <div className="tree">
          <Tree key={this.props.id} {...this.state.treeData} ref={this.treeRef}
            onSelect={this.onSelectGrp}
            onEdit={this.onEditGrp}/>
          </div>

          <div className="table">
          <ItemTable<ITovar> 
            tableKeys={{head:['Id','Name', 'Path'], body:['id','name', 'path']}}
            tableData={this.state.list}
            skey='id'
            onSelect={this.onSelectElm}
            onEdit={this.onEditElm}
            ref={this.itemRef}
          />
          </div>
        </div>
        {/* <button onClick={this.onLoadTable}> Load </button>  */}
        <style jsx>{styles}</style>
      </WindowCl>

  )
  }

}