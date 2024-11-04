//import React, { ReactComponentElement, useState } from 'react'
import * as React from 'react';
import { useWinStore } from '../../pages/+client'
import {shallow} from 'zustand/shallow'
import styles from './index.module.css'
import { WindowCl } from '../Window/winCl';

export function WinManager () {
  console.log('WinManager')
  const [allWin, nWin] = useWinStore((state: any)  => [state.allWin, state.nWin], shallow)
  const elms1 = Array.from(nWin.values()).map((i:any) => i)
  const elms = Array.from(allWin.values()).map((i:any) =>  React.createElement(i.elm, i.props))
  
  return (
    <div>
      {elms1} 
      {/* <WindowCl id={10} caption={'Hello'} modal={false} />  */}
      
    </div>

  )
}


