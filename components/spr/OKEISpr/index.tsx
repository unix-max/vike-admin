import React from 'react'
import { trpc } from "@/trpc/client";
import { WindowCl } from '../../Window/winCl'
import { SprButtons } from '../../SprButtons'
import { ItemTable } from '../../ItemsTable1'
import { OKEIElm } from './elm';
import { useWinStore } from '@/pages/+client'
import { IOKEI } from '@/db/Entitys/OKEI';
//import shallow from 'zustand/shallow'
import styles from './styles.module.css'
//console.log(styles)
const addTWin = useWinStore.getState().addTWin;
const delNWin = useWinStore.getState().delNWin

export type IOKEIProps = {
  id?: number;
  onChoice?: (elm:IOKEI) => void;
}

type TWinId = IOKEIProps & { winId: number }

type OKEISprState = {
  list: IOKEI[];
}

export class OKEISpr extends React.Component<TWinId, OKEISprState>{
  selectElmId?: number;
  itemRef: React.RefObject<ItemTable<IOKEI>>;

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

  onSelectElm = (item: IOKEI) => {
    console.log(item);
    this.selectElmId = item.id;
    this.itemRef.current?.selectItem(this.selectElmId);
  }

  onEditElm = (item:IOKEI) => {
    if(this.props.onChoice) {
      this.props.onChoice(item);
      delNWin(this.props.winId);
    } else {
      addTWin(OKEIElm, {elmId: item.id, renew: this.reloadList});
    }
  }

  reloadList = async () => {
    const  data = await trpc.spr.okei.getList.query();
      //const list = data?.list.map((item)=> ({id: item.code, ...item}))
    if (data) this.setState({list: data.list as IOKEI[]});
  }
  name = () => 'ОКЕИ'
  render() {
    console.log(`render OKEISpr ${this.props.id}`)
    return (
             
      <WindowCl winId={this.props.winId} caption='ОКЕИ' modal={false} key={this.props.winId} size={{width: '200px', height: '300px'}} >    
        <div className={styles.container}>
          <div className={styles.button}>
            <SprButtons 
              onNewElm={()=> addTWin(OKEIElm, { renew: this.reloadList})}
              />
          </div>

          <div className={styles.table}>
          <ItemTable<IOKEI> 
            tableKeys={{head:['Id', 'Code', 'Name', 'Сокр Рус', 'Сокр инт'], body:['id', 'code', 'name', 'sokr_rus', 'sokr_int']}} 
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