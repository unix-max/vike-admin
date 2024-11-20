import React from 'react'
import { trpc } from "@/trpc/client";
import { WindowCl } from '../../Window/winCl'
import { SprButtons } from '../../SprButtons'
import { ItemTable } from '../../ItemsTable'
import { CityElm } from './elm';
import { useWinStore } from '@/pages/+client'
import { ICity} from '@/db/Entitys/City'
//import shallow from 'zustand/shallow'
import styles from './styles.module.css'
//console.log(styles)
const addNWin = useWinStore.getState().addNWin;

export type ICitySprProps = {
  winId: number;
  id?: number;
}

type ICitySprState = {
  list: ICity[];
}

export class CitySpr extends React.Component<ICitySprProps, ICitySprState>{
  selectElmId?: number;
  itemRef: React.RefObject<ItemTable>;

  constructor(props: ICitySprProps) {
    super(props);
    this.itemRef = React.createRef();
    this.state = {
      list: []
  }
  console.log(`Constructor CitySpr ${this.props.id}`)
  this.name = this.name.bind(this);
  }
  async componentDidMount() {
    //console.log(initRequest)

    const  data = await trpc.spr.city.getList.query();
    if (data) this.setState({list: data.list });
    
    //const thiDate = await trpc.demo.query(10);
    console.log(data)
  }

  onSelectElm = (elmId: number) => {
    //console.log(elmId+110);
    this.selectElmId = elmId;
    this.itemRef.current?.selectItem(elmId);

  }
  onEditElm = (elm: ICity) => {
    //console.log(elmId)
  
      addNWin(CityElm, {winId: Date.now() ,elmId: this.selectElmId, renew: this.reloadList});
    
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
             
      <WindowCl winId={this.props.winId} caption='Города' modal={false} key={this.props.id} size={{width: '200px', height: '300px'}} >    
        <div className="container">
          <div className='buttons'>
            <SprButtons 
              onNewElm={()=> addNWin(CityElm, {winId: Date.now(), renew: this.reloadList})}
              />
          </div>

          <div className="table">
          <ItemTable tableKeys={{head:['Id','Name', 'Полное имя', 'ОКСМ'], body:['id', 'name', 'fullname', 'oksm']}} tableData={this.state.list}
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