import React from 'react'
import { trpc } from "@/trpc/client";
import { WindowCl } from '../../Window/winCl'
import { SprButtons } from '../../SprButtons'
import { ItemTable } from '../../ItemsTable1'
import { FirmElm } from './elm';
import { useWinStore } from '@/pages/+client'
import { IFirm } from '@/db/Entitys/spr/Firm';
//import shallow from 'zustand/shallow'
import styles from './styles.module.css'
//console.log(styles)
const addTWin = useWinStore.getState().addTWin;
const delNWin = useWinStore.getState().delNWin


export type ISchetDocProps = {
  id?: number;
  onChoice?: (elm:IFirm) => void;
}

type TWinId = ISchetDocProps & { winId: number }

type ISchetDocState = {
  list: IFirm[];
}

export class FirmSpr extends React.Component<TWinId, ISchetDocState>{
  selectElmId?: number;
  itemRef: React.RefObject<ItemTable<IFirm>>;

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

  onSelectElm = (item: IFirm) => {
      console.log(item);
      this.selectElmId = item.id;
      this.itemRef.current?.selectItem(this.selectElmId);
    }
  
    onEditElm = (item:IFirm) => {
      if(this.props.onChoice) {
        this.props.onChoice(item);
        delNWin(this.props.winId);
      } else {
        addTWin(FirmElm, {elmId: item.id, renew: this.reloadList});
      }
    }
  
    reloadList = async () => {
      const  data = await trpc.spr.firm.getList.query();
        //const list = data?.list.map((item)=> ({id: item.code, ...item}))
      if (data) this.setState({list: data.list as IFirm[]});
    }
    name = () => 'Счета'

    render() {
      console.log(`render ScetDoc ${this.props.id}`)
      return (
               
        <WindowCl winId={this.props.winId} caption='Счета' modal={false} key={this.props.winId} size={{width: '200px', height: '300px'}} >    
          <div className={styles.container}>
            <div className={styles.button}>
              <SprButtons 
                onNewElm={()=> addTWin(FirmElm, { renew: this.reloadList})}
                />
            </div>
  
            <div className={styles.table}>
            <ItemTable<IFirm> 
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