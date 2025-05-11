import React from 'react'
import { trpc } from "@/trpc/client";
import { WindowCl } from '../../Window/winCl'
import { ItemTable } from '../../ItemsTable1'
import { useWinStore } from '@/pages/+client'
import { IFirmAccount } from '@/db/Entitys/spr/FirmAccount';
//import shallow from 'zustand/shallow'
import styles from './styles.module.css'
//console.log(styles)
const addTWin = useWinStore.getState().addTWin;
const delNWin = useWinStore.getState().delNWin

export type FirmAccSprProps = {
  firmId: number;
  onChoice?: (elm:IFirmAccount) => void;
}

type TWinId = FirmAccSprProps & { winId: number }

type IAccSprState = {
  list: IFirmAccount[];
}

export class FirmAccSpr extends React.Component<TWinId, IAccSprState>{
  selectElmId?: number;
  itemRef: React.RefObject<ItemTable<IFirmAccount>>;

  constructor(props: TWinId) {
    super(props);
    this.itemRef = React.createRef();
    this.state = {
      list: []
  }
  console.log(`Constructor CurrencySpr ${this.props.firmId}`)
  }

  async componentDidMount() {
    //console.log(initRequest)
    this.reloadList();
  }

  onSelectElm = (item: IFirmAccount) => {
    console.log(item);
    this.selectElmId = item.id;
    this.itemRef.current?.selectItem(this.selectElmId);
  }

  onEditElm = (item:IFirmAccount) => {
    if(this.props.onChoice) {
      this.props.onChoice(item);
      delNWin(this.props.winId);
    } else {
      
    }
  }

  reloadList = async () => {
    const  data = await trpc.spr.firm.getAccList.query({firmId: this.props.firmId});
      //const list = data?.list.map((item)=> ({id: item.code, ...item}))
    if (data) this.setState({list: data.list as IFirmAccount[]});
  }
  name = () => 'NDS'
  render() {
    console.log(`render FirmAccSpr ${this.props.firmId}`)
    return (
             
      <WindowCl winId={this.props.winId} caption='Счета фирм' modal={false} key={this.props.winId} size={{width: '200px', height: '300px'}} >    
        <div className={styles.container}>
          <div className={styles.button}>
           
          </div>

          <div className={styles.table}>
          <ItemTable<IFirmAccount> 
            tableKeys={{head:['Id', 'Name', 'Номер', 'Банк'], body:['id', 'name', 'number', 'bank' ]}} 
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