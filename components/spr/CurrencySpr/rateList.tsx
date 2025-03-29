import React from 'react'
import { trpc } from "@/trpc/client";
import { WindowCl } from '../../Window/winCl'
import { SprButtons } from '../../SprButtons'
import { ItemTable } from '../../ItemsTable1'
import { CurrencyElm } from './elm';
import { useWinStore } from '@/pages/+client'
import type { RateRecDto } from '@/trpc/api/spr/currency/getRateList';

//import shallow from 'zustand/shallow'
import styles from './styles.module.css'
//console.log(styles)
const addNWin = useWinStore.getState().addNWin;
const delNWin = useWinStore.getState().delNWin

export type ICurrencyRateListProps = {
  curId: number;
  renew?: () => void;
}
type TWinId = ICurrencyRateListProps & { winId: number }

type IRateListState = {
  list: RateRecDto[];
}

export class CurrencyRateList extends React.Component<TWinId, IRateListState>{
  selectElmId?: number;
  itemRef: React.RefObject<ItemTable<RateRecDto>>;

  constructor(props: TWinId) {
    super(props);
    this.itemRef = React.createRef();
    this.state = {
      list: []
  }
  //console.log(`Constructor CurrencySpr ${this.props.id}`)
  }

  async componentDidMount() {
    //console.log(initRequest)
    this.reloadList();
  }

  onSelectElm = (item: RateRecDto) => {
    console.log(item);
    this.selectElmId = item.id;
    this.itemRef.current?.selectItem(this.selectElmId);
  }

  onEditElm = (item:RateRecDto) => {
    
      addNWin(CurrencyElm, {winId: Date.now() ,elmId: item.id, renew: this.reloadList});
    
  }

  reloadList = async () => {
    const data = await trpc.spr.currency.getRateList.query({ id: this.props.curId});
      //const list = data?.list.map((item)=> ({id: item.code, ...item}))
    if (data) this.setState({list: data.list as RateRecDto[] });
  }
  name = () => 'Курсы валют'
  render() {
    //console.log(`render CurrencySpr ${this.props.id}`)
    return (
             
      <WindowCl winId={this.props.winId} caption='Курсы' modal={false} key={this.props.winId} size={{width: '200px', height: '300px'}} >    
        <div className={styles.container}>
          <div className={styles.button}>
            <SprButtons 
              onNewElm={()=> addNWin(CurrencyElm, {winId: Date.now(), renew: this.reloadList})}
              />
          </div>

          <div className={styles.table}>
            <ItemTable<RateRecDto> 
              tableKeys={{head:['Id','Начало', 'Курс'], body:['id','begin', 'rate']}} 
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