import React from 'react'
import { trpc } from "@/trpc/client";
import { WindowCl } from '../../Window/winCl'
import { SprButtons } from '../../SprButtons'
import { ItemTable } from '../../ItemsTable1'
import { CityElm } from './elm';
import { ICity}  from '@/db/Entitys/City'
import { useWinStore } from '@/pages/+client'
//import { ITableString } from '../../ItemsTable1';
//import shallow from 'zustand/shallow'
import styles from './styles.module.css'
//console.log(styles)
const addNWin = useWinStore.getState().addNWin;
const delNWin = useWinStore.getState().delNWin

export type ICitySprProps = {
  winId: number;
  id?: number;
  onChoice?: (elm:ICitySprElm) => void;
}

type ICitySprElm = {
  id: number,
    name: string,
	fullName?: string,
	oksm: string, 
	
}
type ICitySprState = {
  list: ICitySprElm[];
}

export class CitySpr extends React.Component<ICitySprProps, ICitySprState>{
  selectElmId?: number;
  itemRef: React.RefObject<ItemTable<ICitySprElm>>;

  constructor(props: ICitySprProps) {
    super(props);
    this.itemRef = React.createRef();
    this.state = {
      list: []
      }
  console.log(`Constructor CitySpr ${this.props.id}`)

  }
  async componentDidMount() {
    this.reloadList();
  }

  onSelectElm = (elm: ICitySprElm) => {
    //console.log(elmId+110);
    this.selectElmId = elm.id;
    this.itemRef.current?.selectItem(elm.id);

  }
  onEditElm = (elm: ICitySprElm) => {
    if(this.props.onChoice) {
      this.props.onChoice(elm);
      delNWin(this.props.winId);
    } else {
      addNWin(CityElm, {winId: Date.now() ,elmId: this.selectElmId, renew: this.reloadList});
    }
  }
  reloadList = async () => {
    const  data = await trpc.spr.city.getList.query();
    //console.log(data)
    if (data) this.setState({ list: data.list as ICitySprElm[] });
  }
  name = () => 'City'
  
  render() {
    console.log(`render CitySpr ${this.props.id}`)
    return (

      <WindowCl winId={this.props.winId} caption='Города' modal={false} key={this.props.winId} size={{width: '200px', height: '300px'}} >    
        <div className="container">
          <div className='buttons'>
            <SprButtons 
              onNewElm={()=> addNWin(CityElm, {winId: Date.now(), renew: this.reloadList})}
              />
          </div>

          <div className="table">
          <ItemTable<ICitySprElm> 
            tableKeys={{head:['Id','Name', 'Полное имя', 'Страна'], body:['id', 'name', 'full_name', 'oksm']}}
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