import React from 'react'
import { trpc } from "@/trpc/client";
import { ItemTable } from '../../ItemsTable1'
import { FirmAccElm } from './accElm';
import { useWinStore } from '@/pages/+client'
import { accListRecDto } from '@/trpc/api/spr/firm/getAccList';
import { Flex } from '@/components/layout/flex';
//import shallow from 'zustand/shallow'
import styles from './styles.module.css'
//console.log(styles)
const addTWin = useWinStore.getState().addTWin;
const delNWin = useWinStore.getState().delNWin


export type IFirmAccSprProps = {
  firmId?: number;
  mainAcc?: number;
  renew?: ()=>void;
}

type IFirmAccSprState = {
 acc?:accListRecDto;
}

export class FirmAccSpr extends React.Component<IFirmAccSprProps, IFirmAccSprState>{
  selectElmId?: number;
  itemRef: React.RefObject<ItemTable<accListRecDto>>;
  list:accListRecDto[]
  constructor(props: IFirmAccSprProps) {
    super(props);
    this.itemRef = React.createRef();
    this.list = [];
    this.state = {
      
    }
  console.log(`Constructor FirmSpr ${this.props.firmId}`)
  }

  async componentDidMount() {
    this.reloadList();
  }

  onSelectElm = (item: accListRecDto) => {
      console.log(item);
      this.selectElmId = item.id;
      this.itemRef.current?.selectItem(item.id);
      this.setState({acc:this.list[item.ind]})
    }
  
    onEditElm = (item:accListRecDto) => {
      addTWin(FirmAccElm, {elmId: item.id, renew: this.reloadList});
    }
  
    reloadList = async () => {
      if (this.props.firmId) {
        const  data = await trpc.spr.firm.getAccList.query({firmId: this.props.firmId});
        //const list = data?.list.map((item)=> ({id: item.code, ...item}))
      if (data) this.list = data.list;
      this.forceUpdate();
      }
      
    }
  assNumber = () => {
    if (this.props.mainAcc && this.list.length > 0) {
      let arr =  this.list.filter((elm, ind)=> {
      if (elm.id == this.props.mainAcc) return true
      })
      return arr[0]
    }
    return {name: "Не назначен", number: 0}
  }
  setMainAcc =async () => {
    if (this.props.firmId && this.selectElmId && this.selectElmId > 0) {
      const resp = await trpc.spr.firm.setMainAcc.mutate({ id: this.props.firmId, main_id: this.selectElmId });
      if (resp && this.props.renew) this.props.renew(); 
    }
  }
    render() {
      console.log(`render FirmAccSpr ${this.props.firmId}`)
      return (<>
          <Flex>
            <div className={styles.first_box}>
              <div className={styles.table_box}>
            <ItemTable<accListRecDto> 
              tableKeys={{head:['Id', 'Name', 'Номер'], body:['id', 'name', 'number']}} 
              tableData={this.list}
              skey='id'
            onSelect={this.onSelectElm}
            onEdit={this.onEditElm}
            ref={this.itemRef}
            /></div>
            
            <span className={styles.main_acc_box}>Основоной счет: {this.assNumber().name}<br/>
            {this.assNumber().number}
            </span>
            </div>
            <div>
              <fieldset>
              <legend>Счет</legend>
                <table>
                  <tbody>
                  <tr>
                    <td>
                      <label htmlFor="fname">Наименование:</label><br/>
                      <input type="text" name="fname" disabled 
                        defaultValue={this.state.acc?.name }/>
                    </td>
                    <td>
                      <label htmlFor="fnomer">Номер:</label><br/>
                      <input type="text" name="fnomer" disabled 
                        defaultValue={this.state.acc?.number}/>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="fbank">Банк:</label><br/>
                      <input type="text" disabled
                        defaultValue={this.state.acc?.bank.name} name="fbank"/><br/>
                    </td>
                    <td>
                    <label htmlFor="fbik">БИК:</label><br/>
                      <input type="text" disabled
                        defaultValue={this.state.acc?.bank.bik} name="fbik"/><br/>
                    
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="citybank">Город банка:</label><br/>
                      <input type="text" disabled
                        defaultValue={this.state.acc?.bank.city.fullName} name="citybank"/><br/>
                    </td>
                    <td>
                    <label htmlFor="coacc">Кор. счет:</label><br/>
                      <input type="text" disabled
                        defaultValue={this.state.acc?.bank.bik} name="coacc"/><br/>
                    
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="acctype">Тип счета:</label><br/>
                      <input type="text" disabled
                        defaultValue={this.state.acc?.type.name} name="acctype"/><br/>
                    </td>
                    <td>
                    <label htmlFor="acccur">Валюта счета:</label><br/>
                      <input type="text" disabled
                        defaultValue={this.state.acc?.currency.name} name="acccur"/><br/>
                    
                    </td>
                  </tr>
                  </tbody>
                </table>
              </fieldset>
            </div>
            <div>
              <button className={styles.butt}
                onClick={() => addTWin(FirmAccElm, {firmId: this.props.firmId, renew: this.reloadList})}
                >
                  NEW
              </button><br/>
              <button className={styles.butt}
                onClick={() => addTWin(FirmAccElm, {elmId: this.selectElmId, renew: this.reloadList})}
                >
                  Edit
                </button><br/>
              <button className={styles.butt}>Del</button><br/>
              <br/>
              <button className={styles.butt} onClick={this.setMainAcc}>Main</button>
            </div>
            </Flex>

            </>
    )
    }
}