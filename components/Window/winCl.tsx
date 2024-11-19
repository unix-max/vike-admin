import React from 'react'
import { useWinStore } from '../../pages/+client'
import { shallow } from 'zustand/shallow'
import styles from './index.module.css'
//import css from 'styled-jsx/css'
interface IWinProps {
  winId: number,
  caption?: string,
  modal?: boolean,
  size?: {width: string, height: string}
  children?: React.ReactNode
}
const state = useWinStore.getState();
const delNWin = state.delNWin;
const zIndexChange = state.zIndexChange;
// const addSmallWin = state.addSmallWin;

export class WindowCl extends React.Component<IWinProps> {
  winRef: HTMLDivElement | null = null;
  shiftX: number = 0;
  shiftY: number = 0;
  //parent: any = null;
  children: React.ReactNode;
  caption: string = "New";
  zIndex: number;
  unsubZIndex: any;
  unsubMinWin: any;
  
  constructor(props: IWinProps) {
    super(props);
    console.log(props);
    //this.children = props.children;
    //this.caption = props.caption;
    this.zIndex = useWinStore.getState().zIndexArr.indexOf(props.winId);
    //console.log(`zIndex ${this.zIndex}`)
    //addSmallWin(this.id, this.props.caption, false);
  }

  componentDidMount() {
    this.unsubZIndex = useWinStore.subscribe(
      (state) => state.zIndexArr,
      (zIndexArr) => {
        const newZIndex = zIndexArr.indexOf(this.props.winId);
        if (this.zIndex == newZIndex ) return; 
        this.zIndex = newZIndex;
        if(this.winRef) this.winRef.style.zIndex = String(this.zIndex + 10000);
        //console.log(`Window ${this.id} zIndex ${this.zIndex}`)
      },
      { equalityFn: shallow }
     )
     this.unsubMinWin = useWinStore.subscribe(
      (state) => state.smallWin.get(this.props.winId)?.min,
      (smallWinState) => {
        //console.log(`Window ${this.id} min ${smallWinState}`)
        if(this.winRef) {
          if (smallWinState) {
            this.winRef.style.display = 'none';
          } else {
            this.winRef.style.display = 'block';
          }
        }
      },
      { equalityFn: shallow }
     )
     // console.log(this.props.id)
    //  addSmallWin(this.props.winId, this.props.caption, false);
  }

  componentWillUnmount() {
    this.unsubZIndex();
    this.unsubMinWin();
  }
  componentDidUpdate(prevProps: IWinProps) {
    //console.log(`${prevProps.caption} ${this.props.caption}`)
    if (prevProps.caption == this.props.caption) return;
    // addSmallWin(this.props.winId, this.props.caption, false);
  }
    
  onMouseMove = (event: any) =>  {
    //console.log(event)
    //this.moveAt(event.pageX, event.pageY);
    if (this.winRef) {
      this.winRef.style.left = event.pageX - this.shiftX + 'px';
      this.winRef.style.top = event.pageY - this.shiftY + 'px';
    }
  }

  startMove = (event: React.MouseEvent) => {
    //console.log(this.winRef)
    if(this.winRef) {
      this.shiftX = event.clientX - this.winRef.getBoundingClientRect().left;
      this.shiftY = event.clientY - this.winRef.getBoundingClientRect().top;
      //this.winRef.style.position = 'absolute';
      //this.parent = this.winRef.parentNode;
      document.addEventListener('mousemove', this.onMouseMove); 
    }               
  }

stopMove = (event: any) => {
  //console.log(event)
//this.parent.append(this.winRef);
  document.removeEventListener('mousemove', this.onMouseMove);
}

  zIndexCheck = ():void => {
    const zIndexArr = useWinStore.getState().zIndexArr;
    if ((zIndexArr.length < 2) || (this.zIndex == zIndexArr.length-1))  return
    //console.log(this.zIndex);
    if(this.winRef) this.winRef.style.zIndex = String(zIndexArr.length + 9999);
    zIndexChange(this.props.winId);
  }
  minimize = ():void => {
     
    // addSmallWin(this.props.winId, this.props.caption, true);
  }
  render() {
    
    console.log(`render Window ${this.props.winId}`)
    return (
      <div className={styles.win}
        ref={(elm)=> this.winRef=elm}
        style={{zIndex:this.zIndex+10000}}
        onMouseDown={this.zIndexCheck}
        >
        <div className={styles.header} onMouseUp={this.stopMove} onMouseDown={this.startMove} >
          <div className={styles.headerText}>
            {this.props.caption}
          </div>
          <div className={styles.btnBox}>
            <img src="/assets/winMin.svg" onClick={this.minimize}/>
            <img src="/assets/winMax.svg"/>
            <img src="/assets/winClose.svg" onClick={() => delNWin(this.props.winId)}/>
                        
          </div>
        </div>
        {this.props.children}

        {this.props.size ?
          <style>{`
            .${styles.win}{
              width: ${this.props.size.width};
              height: ${this.props.size.height};
              }
            `}
          </style>
        :''
      
      }
        
      </div>
        
    )
  }
}