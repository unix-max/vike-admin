import React from 'react'
import { trpc } from "@/trpc/client";
import { WindowCl } from '../../Window/winCl'
import { SprButtons } from '../../SprButtons'
import { ItemTable } from '../../ItemsTable1'
import { BankElm } from './elm';
import { useWinStore } from '@/pages/+client'
//import { ITableString } from '../../ItemsTable1';
//import shallow from 'zustand/shallow'
import styles from './styles.module.css'
//console.log(styles)
const addNWin = useWinStore.getState().addNWin;
const delNWin = useWinStore.getState().delNWin

export type IBankSprProps = {
  winId: number;
  id?: number;
  onChoice?: (elm:IBankSprElm) => void;
}

type IBankSprElm = {
  id: number,
  name: string,
  bik: string,
	city: string, 
	
}
type IBankSprState = {
  list: IBankSprElm[];
}

export class BankSpr extends React.Component<IBankSprProps, IBankSprState>{
  selectElmId?: number;
  itemRef: React.RefObject<ItemTable<IBankSprElm>>;

  constructor(props: IBankSprProps) {
    super(props);
    this.itemRef = React.createRef();
    this.state = {
      list: []
      }
  console.log(`Constructor BankSpr ${this.props.id}`)

  }
  async componentDidMount() {
    this.reloadList();
  }

  onSelectElm = (elm: IBankSprElm) => {
    //console.log(elmId+110);
    this.selectElmId = elm.id;
    this.itemRef.current?.selectItem(elm.id);

  }
  onEditElm = (elm: IBankSprElm) => {
    if(this.props.onChoice) {
      this.props.onChoice(elm);
      delNWin(this.props.winId);
    } else {
      addNWin(BankElm, {winId: Date.now() ,elmId: this.selectElmId, renew: this.reloadList});
    }
    
  }
  reloadList = async () => {
    const  data = await trpc.spr.bank.getList.query();
    //console.log(data)
    if (data) this.setState({ list: data.list as IBankSprElm[] });
  }
  name = () => 'Bank'
  
  render() {
    console.log(`render BankSpr ${this.props.id}`)
    return (
             
      <WindowCl winId={this.props.winId} caption='Банки' modal={false} key={this.props.winId} size={{width: '200px', height: '300px'}} >    
        <div className="container">
          <div className='buttons'>
            <SprButtons 
              onNewElm={()=> addNWin(BankElm, {winId: Date.now(), renew: this.reloadList})}
              />
          </div>

          <div className="table">
          <ItemTable<IBankSprElm> 
            tableKeys={{head:['Id','Name', 'БИК', 'Город'], body:['id', 'name', 'bik', 'city']}}
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