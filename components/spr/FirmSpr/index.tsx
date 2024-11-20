import React from 'react'
import { trpc } from "@/trpc/client";
import { WindowCl } from '../../Window/winCl'
import { SprButtons } from '../../SprButtons'
import { ItemTable } from '../../ItemsTable'
import { FirmElm } from './elm';
import { useWinStore } from '@/pages/+client'
import { IFirm } from '@/db/Entitys/Firm';
//import shallow from 'zustand/shallow'
import styles from './styles'
//console.log(styles)
const addNWin = useWinStore.getState().addNWin;

export type IFirmSprProps = {
  winId: number;
  id?: number;
}

type IFirmSprState = {
  list: IFirm[];
}

export class FirmSpr extends React.Component<IFirmSprProps, IFirmSprState>{
  selectElmId?: number;
  itemRef: React.RefObject<ItemTable>;

  constructor(props: IFirmSprProps) {
    super(props);
    this.itemRef = React.createRef();
    this.state = {
      list: [{id: 0, }]
  }
  console.log(`Constructor KlientSpr ${this.props.id}`)
  this.name = this.name.bind(this);
  }
  async componentDidMount() {
    this.reloadList();
  }

  onSelectElm = (elmId: number) => {
    //console.log(elmId+110);
    this.selectElmId = elmId;
    this.itemRef.current?.selectItem(elmId);

  }
  onEditElm = (elm: IFirm) => {
    //console.log(elmId)
  
      addNWin(FirmElm, {winId: Date.now() ,elmId: this.selectElmId, renew: this.reloadList});
    
  }
  reloadList = async () => {
    const  data = await trpc.spr.firm.getList.query();
    console.log(data)
    if (data) this.setState({ list: data.list });
  }

 
  name() {
    return 'Товары';
  }
  
  
  render() {
    console.log(`render KlientSpr ${this.props.id}`)
    return (
             
      <WindowCl winId={this.props.winId} caption='Фирмы' modal={false} key={this.props.id} >    
        
          <div className='buttons'>
            <SprButtons 
              onNewElm={()=> addNWin(FirmElm, {winId: Date.now(), renew: this.reloadList})}
              />
          </div>

          <div className="table">
          <ItemTable tableKeys={{head:['Id','Name', 'phone'], body:['id','name', 'phone']}} tableData={this.state.list}
          onSelect={this.onSelectElm}
          onEdit={this.onEditElm}
          ref={this.itemRef}
          />
          </div>
        
        <style jsx>{styles}</style>
      </WindowCl>

  )
  }

}