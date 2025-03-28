import React from 'react'
import { trpc } from "@/trpc/client";
import { WindowCl } from '../../Window/winCl'
import { SprButtons } from '../../SprButtons'
import { ItemTable } from '../../ItemsTable1'
import { CurrencyElm } from './elm';
import { useWinStore } from '@/pages/+client'
import { ICurrency } from '@/db/Entitys/Currency'
//import shallow from 'zustand/shallow'
import styles from './styles.module.css'
//console.log(styles)
const addNWin = useWinStore.getState().addNWin;
const delNWin = useWinStore.getState().delNWin

export type IOKSMSprProps = {
  winId: number;
  id?: number;
  onChoice?: (elm:ICurrency) => void;
}

type IOKSMSprState = {
  list: ICurrency[];
}

export class CurrencySpr extends React.Component<IOKSMSprProps, IOKSMSprState>{
  selectElmId?: number;
  itemRef: React.RefObject<ItemTable<ICurrency>>;

  constructor(props: IOKSMSprProps) {
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

  onSelectElm = (item: ICurrency) => {
    console.log(item);
    this.selectElmId = item.id;
    this.itemRef.current?.selectItem(this.selectElmId);
  }

  onEditElm = (item:ICurrency) => {
    if(this.props.onChoice) {
      this.props.onChoice(item);
      delNWin(this.props.winId);
    } else {
      addNWin(CurrencyElm, {winId: Date.now() ,elmId: item.id, renew: this.reloadList});
    }
  }

  reloadList = async () => {
    const  data = await trpc.spr.currency.getList.query();
      //const list = data?.list.map((item)=> ({id: item.code, ...item}))
    if (data) this.setState({list: data.list as ICurrency[] });
  }
  name = () => 'Currency'
  render() {
    console.log(`render CurrencySpr ${this.props.id}`)
    return (
             
      <WindowCl winId={this.props.winId} caption='Валюты' modal={false} key={this.props.winId} size={{width: '200px', height: '300px'}} >    
        <div className={styles.container}>
          <div className={styles.button}>
            <SprButtons 
              onNewElm={()=> addNWin(CurrencyElm, {winId: Date.now(), renew: this.reloadList})}
              />
          </div>

          <div className={styles.table}>
            <ItemTable<ICurrency> 
              tableKeys={{head:['Id','Code', 'Sokr', 'Symbol', 'Name', 'Курс', 'Alias'], body:['id','code', 'sokr', 'symbol', 'name', 'rate', 'alias']}} 
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