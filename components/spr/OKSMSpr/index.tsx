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
const addNWin = useWinStore.getState().addNWin;

export type IOKSMSprProps = {
  winId: number;
  id?: number;
}

type IOKSMSprState = {
  list: IOKSM[];
}

export class OKSMSpr extends React.Component<IOKSMSprProps, IOKSMSprState>{
  selectElmId?: number;
  itemRef: React.RefObject<ItemTable<IOKSM>>;

  constructor(props: IOKSMSprProps) {
    super(props);
    this.itemRef = React.createRef();
    this.state = {
      list: []
  }
  console.log(`Constructor OKSMSpr ${this.props.id}`)
  this.name = this.name.bind(this);
  }

  async componentDidMount() {
    //console.log(initRequest)
    this.reloadList();
  }

  onSelectElm = (item: IOKSM) => {
    //console.log(elmId+110);
    this.selectElmId = item.code;
    this.itemRef.current?.selectItem(this.selectElmId);

  }
  onEditElm = (id:any) => {
    //console.log(elmId)
  
      addNWin(OKSMElm, {winId: Date.now() ,elmId: this.selectElmId, renew: this.reloadList});
    
  }
  reloadList = async () => {
    const  data = await trpc.spr.oksm.getList.query();
      //const list = data?.list.map((item)=> ({id: item.code, ...item}))
    if (data) this.setState({list: data.list as IOKSM[] });
  }

 
  name() {
    return 'Товары';
  }
  
  
  render() {
    console.log(`render KlientSpr ${this.props.id}`)
    return (
             
      <WindowCl winId={this.props.winId} caption='Страны' modal={false} key={this.props.id} size={{width: '200px', height: '300px'}} >    
        <div className={styles.container}>
          <div className={styles.button}>
            <SprButtons 
              onNewElm={()=> addNWin(OKSMElm, {winId: Date.now(), renew: this.reloadList})}
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