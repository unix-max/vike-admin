import React from 'react'
import { trpc } from "@/trpc/client";
import { WindowCl } from '../../Window/winCl'
import { SprButtons } from '../../SprButtons'
import { ItemTable } from '../../ItemsTable1'
import { OKSMElm } from './elm';
import { useWinStore } from '@/pages/+client'
import { IOKSM } from '@/db/Entitys/OKSM'
//import shallow from 'zustand/shallow'
import styles from './styles.module.css'
//console.log(styles)
const addTWin = useWinStore.getState().addTWin;
const delNWin = useWinStore.getState().delNWin

export type IOKSMSprProps = {
  id?: number;
  onChoice?: (elm:IOKSM) => void;
}
type TWinId = IOKSMSprProps & { winId: number }

type IOKSMSprState = {
  list: IOKSM[];
}

export class OKSMSpr extends React.Component<TWinId, IOKSMSprState>{
  selectElmId?: number;
  itemRef: React.RefObject<ItemTable<IOKSM>>;

  constructor(props: TWinId) {
    super(props);
    this.itemRef = React.createRef();
    this.state = {
      list: []
  }
  console.log(`Constructor OKSMSpr ${this.props.id}`)
  }

  async componentDidMount() {
    //console.log(initRequest)
    this.reloadList();
  }

  onSelectElm = (item: IOKSM) => {
    console.log(item);
    this.selectElmId = item.id;
    this.itemRef.current?.selectItem(this.selectElmId);

  }
  onEditElm = (item:IOKSM) => {
    if(this.props.onChoice) {
      this.props.onChoice(item);
      delNWin(this.props.winId);
    } else {
      addTWin(OKSMElm, {elmId: item.id, renew: this.reloadList});
    }
  
      
    
  }
  reloadList = async () => {
    const  data = await trpc.spr.oksm.getList.query();
      //const list = data?.list.map((item)=> ({id: item.code, ...item}))
    if (data) this.setState({list: data.list as IOKSM[] });
  }
  name = () => 'OKSM'
  render() {
    console.log(`render KlientSpr ${this.props.id}`)
    return (
             
      <WindowCl winId={this.props.winId} caption='Страны' modal={false} key={this.props.winId} size={{width: '200px', height: '300px'}} >    
        <div className={styles.container}>
          <div className={styles.button}>
            <SprButtons 
              onNewElm={()=> addTWin(OKSMElm, { renew: this.reloadList})}
              />
          </div>

          <div className={styles.table}>
          <ItemTable<IOKSM> 
            tableKeys={{head:['Id','Code','Name', 'Полное имя', 'a2', 'a3', 'alias'], body:['id','code', 'name', 'full_name', 'a2', 'a3', 'alias']}} 
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