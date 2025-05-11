import React from 'react'
import { trpc } from "@/trpc/client";
import { WindowCl } from '../../Window/winCl'
import { SprButtons } from '../../SprButtons'
import { ItemTable } from '../../ItemsTable1'
import { SkladElm } from './elm';
import { useWinStore } from '@/pages/+client'
import { ISklad} from '@/db/Entitys/spr/Sklad'
//import shallow from 'zustand/shallow'
import styles from './styles.module.css'

//console.log(styles)
const addTWin = useWinStore.getState().addTWin;
const delNWin = useWinStore.getState().delNWin

export type ISkladSprProps = {
  id?: number;
  onChoice?: (elm:ISkladSprElm) => void;
}

type TWinId = ISkladSprProps & { winId: number }

type ISkladSprElm = {
  id: number,
    name: string,
	fullName?: string,
	oksm: string, 
	
}

type ISkladSprState = {
  list: ISkladSprElm[];
}

export class SkladSpr extends React.Component<TWinId, ISkladSprState>{
  selectElmId?: number;
  itemRef: React.RefObject<ItemTable<ISkladSprElm>>;

  constructor(props: TWinId) {
    super(props);
    this.itemRef = React.createRef();
    this.state = {
      list: []
  }
  console.log(`Constructor SkladSpr Id:${this.props.id}`)

  }
  async componentDidMount() {
		this.reloadList();
  }

  onSelectElm = (elm: ISkladSprElm) => {
    //console.log(elmId+110);
    this.selectElmId = elm.id;
    this.itemRef.current?.selectItem(elm.id);

  }
  onEditElm = (elm: ISkladSprElm) => {
		if(this.props.onChoice) {
      this.props.onChoice(elm);
      delNWin(this.props.winId);
    } else {
      addTWin(SkladElm, {elmId: this.selectElmId, renew: this.reloadList});
		}
  }

  reloadList = async () => {
    const  data = await trpc.spr.sklad.getList.query();
    console.log(data)
    if (data) this.setState({ list: data.list as ISkladSprElm[] });
  }

 
	name = () => 'Sklad'
  
  render() {
    console.log(`render SkladSpr, Id:${this.props.id}`)
    return (
             
      <WindowCl winId={this.props.winId} caption='Склады' modal={false} key={this.props.winId} size={{width: '200px', height: '300px'}}>    
        <div className={styles.container}>
          <div className={styles.button}>
            <SprButtons 
              onNewElm={()=> addTWin(SkladElm, {renew: this.reloadList})}
              />
          </div>

          <div className={styles.table}>
          <ItemTable<ISkladSprElm>
						tableKeys={{head:['Id','Name', 'МОЛ'], body:['id','name','mol']}}
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