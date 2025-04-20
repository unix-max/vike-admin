import React from 'react'
import { trpc } from "@/trpc/client";
import { WindowCl } from '../../Window/winCl'
import { SprButtons } from '../../SprButtons'
import { ItemTable } from '../../ItemsTable1'
import { AccTypeElm } from './elm';
import { useWinStore } from '@/pages/+client'
import { IAccountType } from '@/db/Entitys/AccountType';
//import shallow from 'zustand/shallow'
import styles from './styles.module.css'
//console.log(styles)
const addTWin = useWinStore.getState().addTWin;
const delNWin = useWinStore.getState().delNWin

export type IAccountTypeProps = {
  id?: number;
  onChoice?: (elm:IAccountType) => void;
}

type TWinId = IAccountTypeProps & { winId: number }

type IAccTypeSprState = {
  list: IAccountType[];
}

export class AccTypeSpr extends React.Component<TWinId, IAccTypeSprState>{
  selectElmId?: number;
  itemRef: React.RefObject<ItemTable<IAccountType>>;

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

  onSelectElm = (item: IAccountType) => {
    console.log(item);
    this.selectElmId = item.id;
    this.itemRef.current?.selectItem(this.selectElmId);
  }

  onEditElm = (item:IAccountType) => {
    if(this.props.onChoice) {
      this.props.onChoice(item);
      delNWin(this.props.winId);
    } else {
      addTWin(AccTypeElm, {elmId: item.id, renew: this.reloadList});
    }
  }

  reloadList = async () => {
    const  data = await trpc.spr.accType.getList.query();
      //const list = data?.list.map((item)=> ({id: item.code, ...item}))
    if (data) this.setState({list: data.list as IAccountType[]});
  }
  name = () => 'Типы счетов'
  render() {
    console.log(`render AccTypeSpr ${this.props.id}`)
    return (
             
      <WindowCl winId={this.props.winId} caption='Типы счетов' modal={false} key={this.props.winId} size={{width: '200px', height: '300px'}} >    
        <div className={styles.container}>
          <div className={styles.button}>
            <SprButtons 
              onNewElm={()=> addTWin(AccTypeElm, { renew: this.reloadList})}
              />
          </div>

          <div className={styles.table}>
          <ItemTable<IAccountType> 
            tableKeys={{head:['Id', 'Name', 'Описание'], body:['id', 'name', 'descript']}} 
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