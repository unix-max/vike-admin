import React from 'react'
import { trpc } from "@/trpc/client";
import { WindowCl } from '../../Window/winCl'
import { SprButtons } from '../../SprButtons'
import { ItemTable } from '../../ItemsTable1'
import { NDSElm } from './elm';
import { useWinStore } from '@/pages/+client'
import { INDS } from '@/db/Entitys/spr/Nds'
//import shallow from 'zustand/shallow'
import styles from './styles.module.css'
//console.log(styles)
const addTWin = useWinStore.getState().addTWin;
const delNWin = useWinStore.getState().delNWin

export type NDSSprProps = {
  id?: number;
  onChoice?: (elm:INDS) => void;
}

type TWinId = NDSSprProps & { winId: number }

type INDSSprState = {
  list: INDS[];
}

export class NDSSpr extends React.Component<TWinId, INDSSprState>{
  selectElmId?: number;
  itemRef: React.RefObject<ItemTable<INDS>>;

  constructor(props: TWinId) {
    super(props);
    this.itemRef = React.createRef();
    this.state = {
      list: []
  }
  console.log(`Constructor CurrencySpr ${this.props.id}`)
  }

  async componentDidMount() {
    //console.log(initRequest)
    this.reloadList();
  }

  onSelectElm = (item: INDS) => {
    console.log(item);
    this.selectElmId = item.id;
    this.itemRef.current?.selectItem(this.selectElmId);
  }

  onEditElm = (item:INDS) => {
    if(this.props.onChoice) {
      this.props.onChoice(item);
      delNWin(this.props.winId);
    } else {
      addTWin(NDSElm, {elmId: item.id, renew: this.reloadList});
    }
  }

  reloadList = async () => {
    const  data = await trpc.spr.nds.getList.query();
      //const list = data?.list.map((item)=> ({id: item.code, ...item}))
    if (data) this.setState({list: data.list as INDS[]});
  }
  name = () => 'NDS'
  render() {
    console.log(`render NDSSpr ${this.props.id}`)
    return (
             
      <WindowCl winId={this.props.winId} caption='НДС' modal={false} key={this.props.winId} size={{width: '200px', height: '300px'}} >    
        <div className={styles.container}>
          <div className={styles.button}>
            <SprButtons 
              onNewElm={()=> addTWin(NDSElm, { renew: this.reloadList})}
              />
          </div>

          <div className={styles.table}>
          <ItemTable<INDS> 
            tableKeys={{head:['Id', 'Name', 'Значение'], body:['id', 'name', 'val']}} 
            tableData={this.state.list}
            skey='id'
          onSelect={this.onSelectElm}
          onEdit={this.onEditElm}
          ref={this.itemRef}
          />
          </div>
        </div>

      </WindowCl>

  )
  }

}