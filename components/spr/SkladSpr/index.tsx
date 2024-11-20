import React from 'react'
import { trpc } from "@/trpc/client";
import { WindowCl } from '../../Window/winCl'
import { SprButtons } from '../../SprButtons'
import { ItemTable } from '../../ItemsTable'
import { SkladElm } from './elm';
import { useWinStore } from '@/pages/+client'
import { ISklad} from '@/db/Entitys/Sklad'
//import shallow from 'zustand/shallow'
import styles from './styles'
//console.log(styles)
const addNWin = useWinStore.getState().addNWin;

export type IKlientSprProps = {
  winId: number;
  id?: number;
}

type IKlientSprState = {
  list: ISklad[];
}

export class SkladSpr extends React.Component<IKlientSprProps, IKlientSprState>{
  selectElmId?: number;
  itemRef: React.RefObject<ItemTable>;

  constructor(props: IKlientSprProps) {
    super(props);
    this.itemRef = React.createRef();
    this.state = {
      list: [{id: 0, }]
  }
  console.log(`Constructor KlientSpr ${this.props.id}`)
  this.name = this.name.bind(this);
  }
  async componentDidMount() {
    //console.log(initRequest)

    const  data = await trpc.spr.sklad.getList.query();
    if (data) this.setState({list: data.list });
    
    //const thiDate = await trpc.demo.query(10);
    console.log(data)
  }

  onSelectElm = (elmId: number) => {
    //console.log(elmId+110);
    this.selectElmId = elmId;
    this.itemRef.current?.selectItem(elmId);

  }
  onEditElm = (elm: ISklad) => {
    //console.log(elmId)
  
      addNWin(SkladElm, {winId: Date.now() ,elmId: this.selectElmId, renew: this.reloadList});
    
  }
  reloadList = async () => {
    const  data = await trpc.spr.sklad.getList.query();
    console.log(data)
    if (data) this.setState({ list: data.list });
  }

 
  name() {
    return 'Товары';
  }
  
  
  render() {
    console.log(`render KlientSpr ${this.props.id}`)
    return (
             
      <WindowCl winId={this.props.winId} caption='Склады' modal={false} key={this.props.id} >    
        <div className="container">
          <div className='buttons'>
            <SprButtons 
              onNewElm={()=> addNWin(SkladElm, {winId: Date.now(), renew: this.reloadList})}
              />
          </div>

          <div className="table">
          <ItemTable tableKeys={{head:['Id','Name'], body:['id','name']}} tableData={this.state.list}
          onSelect={this.onSelectElm}
          onEdit={this.onEditElm}
          ref={this.itemRef}
          />
          </div>
        </div>
        <style jsx>{styles}</style>
      </WindowCl>

  )
  }

}