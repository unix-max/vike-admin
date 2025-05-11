import React from 'react'
import { trpc } from "@/trpc/client";
import { WindowCl } from '../../Window/winCl'
import { SprButtons } from '../../SprButtons'
import { ItemTable } from '../../ItemsTable1'
import { SchetDoc } from './elm';
import { useWinStore } from '@/pages/+client'
import { ISchet } from '@/db/Entitys/doc/Schet';
//import shallow from 'zustand/shallow'
import styles from './styles.module.css'
//console.log(styles)
const addTWin = useWinStore.getState().addTWin;
const delNWin = useWinStore.getState().delNWin


export type ISchetDocProps = {
  id?: number;
  onChoice?: (elm:ISchet) => void;
}

type TWinId = ISchetDocProps & { winId: number }

type ISchetDocState = {
  list: ISchet[];
}

export class SchetJorn extends React.Component<TWinId, ISchetDocState>{
  selectElmId?: number;
  itemRef: React.RefObject<ItemTable<ISchet>>;

  constructor(props: TWinId) {
    super(props);
    this.itemRef = React.createRef();
    this.state = {
      list: []
    }
  console.log(`Constructor ScetDoc ${this.props.id}`)
  }

  async componentDidMount() {
    this.reloadList();
  }

  onSelectElm = (item: ISchet) => {
      console.log(item);
      this.selectElmId = item.id;
      this.itemRef.current?.selectItem(this.selectElmId);
    }
  
    onEditElm = (item:ISchet) => {
      if(this.props.onChoice) {
        this.props.onChoice(item);
        delNWin(this.props.winId);
      } else {
        addTWin(SchetDoc, {elmId: item.id, renew: this.reloadList});
      }
    }
  
    reloadList = async () => {
      const  data = await trpc.doc.schet.getJorn.query();
        console.log(data);
      if (data) this.setState({list: data.list as ISchet[]});
    }
    name = () => 'Счета'

    render() {
      console.log(`render ScetDoc ${this.props.id}`)
      return (
               
        <WindowCl winId={this.props.winId} caption='Счета' modal={false} key={this.props.winId} size={{width: '200px', height: '300px'}} >    
          <div className={styles.container}>
            <div className={styles.button}>
              <SprButtons 
                onNewElm={()=> addTWin(SchetDoc, { renew: this.reloadList})}
                />
            </div>
  
            <div className={styles.table}>
            <ItemTable<ISchet> 
              tableKeys={{head:['Id', 'Дата', 'Фирма', 'Клиент', 'Сумма'], body:['id', 'date', 'firm', 'client', 'sum']}} 
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