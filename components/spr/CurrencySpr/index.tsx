import React from 'react'
import { trpc } from "@/trpc/client";
import { WindowCl } from '../../Window/winCl'
import { SprButtons } from '../../SprButtons'
import { ItemTable } from '../../ItemsTable1'
import { CurrencyElm, CurrencyElmProps } from './elm';
import { useWinStore } from '@/pages/+client'
import { ICurrency } from '@/db/Entitys/Currency'
import { CurrencyRateList } from './rateList'
import type { ICurrencyRateListProps } from './rateList';
//import shallow from 'zustand/shallow'
import styles from './styles.module.css'
//console.log(styles)
//const addNWin = useWinStore.getState().addNWin;
const addTWin = useWinStore.getState().addTWin;
const delNWin = useWinStore.getState().delNWin

export type ICurrencySprProps = {
  winId: number;
  id?: number;
  onChoice?: (elm:ICurrency) => void;
}

type ICurrencySprState = {
  list: ICurrency[];
}

export class CurrencySpr extends React.Component<ICurrencySprProps, ICurrencySprState>{
  selectElmId?: number;
  itemRef: React.RefObject<ItemTable<ICurrency>>;

  constructor(props: ICurrencySprProps) {
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
      addTWin<CurrencyElmProps>(CurrencyElm, {elmId: item.id, renew: this.reloadList});
    }
  }

  reloadList = async () => {
    const  data = await trpc.spr.currency.getList.query();
      //const list = data?.list.map((item)=> ({id: item.code, ...item}))
    if (data) this.setState({list: data.list as ICurrency[] });
  }

  onOpenRate =() => {
    if (this.selectElmId)
    addTWin<ICurrencyRateListProps>(CurrencyRateList, { curId: this.selectElmId, renew: this.reloadList})
  }

  name = () => 'Currency'
  render() {
    console.log(`render CurrencySpr ${this.props.id}`)
    return (
             
      <WindowCl winId={this.props.winId} caption='Валюты' modal={false} key={this.props.winId} size={{width: '200px', height: '300px'}} >    
        <div className={styles.container}>
          <div className={styles.button}>
            <SprButtons 
              onNewElm={()=> addTWin<CurrencyElmProps>(CurrencyElm, { renew: this.reloadList})}
              />
              <button onClick={this.onOpenRate}>
                Rate
                </button>
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