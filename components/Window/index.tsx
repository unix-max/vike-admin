import React, { ReactComponentElement, useState, useEffect } from 'react'
import { useWinStore } from '../../pages/+client'
import {shallow} from 'zustand/shallow'
import {className, styles } from './styles'

console.log(className)
console.log(styles)
export interface IWinProps {
  id: number,
  caption: string,
  modal: boolean,
  children?: React.ReactNode
}
 
  interface winData {
    winRef: HTMLDivElement | null,
    shiftX: number,
    shiftY: number,
  //let parent: any = null;
}

  const moveAt = (event: any, data: winData) => {
    if (data.winRef) {
      data.winRef.style.left = event.pageX - data.shiftX + 'px';
      data.winRef.style.top = event.pageY - data.shiftY + 'px';
    }
  }
    
  let onMouseMove = (event:any) =>  {}

  const startMove = (event: React.MouseEvent, winRef:HTMLDivElement | null) => {
    //console.log(this.winRef)
    //winClick(); 
    if(winRef) {
      const data: winData = {
        winRef,
        shiftX: event.clientX - winRef.getBoundingClientRect().left,
        shiftY: event.clientY - winRef.getBoundingClientRect().top
      }
      //winRef.style.position = 'absolute';
      //parent = winRef.parentNode;
      onMouseMove = (event:any) => moveAt(event, data)
      document.addEventListener('mousemove', onMouseMove); 
    }               
  }

  const stopMove = (event: any) => {
  //console.log(event)
//this.parent.append(this.winRef);
  document.removeEventListener('mousemove', onMouseMove);
  }
   const unsub3 = useWinStore.subscribe(
     
     () => console.log(`Window ${111}`)

      
      
      
    )
  export const Window: React.FC<IWinProps> = (props: IWinProps) => {
    console.log(`Render Window ${props.id}`);
    const [addSmallWin, hasMinWin, delWin, zIndexChange] = useWinStore((state: any)  => [
      state.addSmallWin,
      state.smallWin.has(props.id),
      state.delWin,
      state.zIndexChange
    ], shallow);
    let winRef: HTMLDivElement | null;
    //const zIndex = useWinStore.getState().allWin.get(props.id)?.zIndex; //allWin.get(props.id)?.zIndex;
    //console.log(zIndex)
    const zIndexArr = useWinStore.getState().zIndexArr;
    const zIndex = zIndexArr.indexOf(props.id);
    //console.log(zIndex)

   

    const minimize = ():void => {
     
      addSmallWin(props.id, props.caption);
    }

    const zIndexCheck = (id: number):void => {
      if ((zIndexArr.length < 2) || (zIndex == zIndexArr.length-1))  return
      console.log(zIndex);
      if(winRef) winRef.style.zIndex='10100';
      zIndexChange(id, zIndex);
    }

    return (
      <div className={`${className} win`} ref={(elm)=> winRef=elm}
        onMouseDown={()=> zIndexCheck(props.id)}
        >
      <div className={`${className} header`} onMouseUp={stopMove} onMouseDown={(event) => startMove(event, winRef)} >
          <div className={`${className} headerText`}>
            {props.caption}
          </div>
          <div className={`${className} btnBox`}>
            <img src="/assets/winMin.svg" onClick={minimize}/>
            <img src="/assets/winMax.svg"/>
            <img src="/assets/winClose.svg" onClick={() => delWin(props.id)}/>
                        
          </div>
        </div>
        {props.children}
        {styles}

        <style jsx>{`
          .win{
            display: ${hasMinWin ? 'none' : 'block'};
            z-index: ${zIndex};
          }
        `}</style>
      </div>
        
    )
  }
