import React, { ReactComponentElement, useState } from 'react'
import { useWinStore } from '../../pages/+client'
import { shallow} from 'zustand/shallow'
import styles from './styles.module.css'

function MinWinElm(props: {id :number, name: string, min: boolean}) {
  //  console.log(props)
    const [addSmallWin, zIndexChange] = useWinStore((state: any)  => [state.addSmallWin, state.zIndexChange])
    return (
      <div className={styles.minWin} key = {props.id} onClick={()=> zIndexChange(props.id)}>
        <div className={styles.winName}>{props.name}</div>
        <img className={styles.icon} src="/assets/winMax.svg" onClick={()=> addSmallWin(props.id, props.name, !props.min)}/>

        <style jsx>{`
          .minWin {
            background: linear-gradient(90deg, ${props.min ? 'green' : 'blue'}, white);   
          }
        `}</style>

      </div>
    
    )
  }
  
export function WinPanel() {
  const [smallWin] = useWinStore((state: any)  => [state.smallWin], shallow)
  const [nWin] = useWinStore((state: any)  => [state.nWin], shallow)
  const arrMinWin = Array.from(smallWin.entries())
  const arrNWin = Array.from(nWin.entries())
    //console.log(arrNWin?.[0][1].ref.current.name())
    //console.log(smallWin)
  return (
    <section className={styles.wrapper}>
  	  {/* {arrMinWin.map((val:any) => <MinWinElm key={val[0]} id={val[0]} name={val[1].name} min={val[1].min}/>)} */}
      {arrNWin.map((val:any) => <MinWinElm key={val[0]} id={val[0]} name={val[1]?.ref?.current?.name()} min={false}/>)}
    </section>
  )
}