import * as React from 'react';
import { createWithEqualityFn as create } from 'zustand/traditional'
import { subscribeWithSelector } from 'zustand/middleware'

type IProps = {
  [prop: string]: any

    
}
export type IComponentProps = {
  winId: number;
  [key: string]: any;
  
}

// interface IElmDraft {
//   elm: React.ComponentType<IComponentProps>;
//   props: IComponentProps;
//   zIndex?: number;
//   //zIndex: number;
//  }
interface wmStore {
  nWin: Map<number, React.ReactNode>
  // allWin: Map<number, IElmDraft>;
  smallWin: Map<number, {name: string|undefined, min: boolean}>;
  zIndexArr: number[];
  // addWin: (elm: React.ComponentType<IComponentProps>, props:IComponentProps) => void;
  addNWin: (elm: React.ComponentType<IComponentProps>, props:IComponentProps) => void;
  addTWin: <T extends IProps>(elm: React.ComponentType<T & { winId: number }>, props:T) => void;
  // delWin: (id: number) => void;
  delNWin: (winId: number) => void;
  addSmallWin: (id: number, name:string|undefined, min: boolean) => void;
  delSmallWin: (id: number) => void;
  zIndexChange: (id: number) => void;
}

export const useWinStore = create<wmStore>()(subscribeWithSelector((set, get) => ({
    nWin: new Map(),
    allWin: new Map(),
    //smallWin: new Set(),
    smallWin: new Map(),
    zIndexArr: [],
    addNWin: (elm: React.ComponentType<IComponentProps>, props: IComponentProps) => set((state) => {
      //const winId: number = Date.now();
      state.zIndexArr.push(props.winId);
      
      return {nWin: new Map(state.nWin).set(props.winId, React.createElement<IComponentProps>(elm, {key: props.winId, ref: React.createRef(), ...props}))}

    }),
    addTWin: <T extends IProps>(elm: React.ComponentType<T & { winId: number }>, tprops: T) => set((state) => {
      const winId: number = Date.now();
      state.zIndexArr.push(winId);
      
      return {nWin: new Map(state.nWin).set(winId, React.createElement<T & { winId: number }>(elm, {winId: winId, key: winId, ref: React.createRef(), ...tprops}))}

    }),
    
    delNWin: (winId: number) => set((state) => {
      const nWin = new Map(state.nWin);
      nWin.delete(winId);

      const newArray = state.zIndexArr.slice();
      const index = newArray.indexOf(winId);
      newArray.splice(index, 1);
      state.delSmallWin(winId);
      return {nWin: nWin, zIndexArr: newArray}
    }),
    // addWin: (elm: React.ComponentType<IComponentProps>, props: IComponentProps) => set((state) => {
    //   //console.log(state.allWin);
    //   const id: number = Date.now();
    //   props.id = id;
    //   //const zIndex = state.allWin.size +10000;
    //   state.zIndexArr.push(id);
    //   const elmDraft = {elm, props: {key: id, ...props}}
    //   return {allWin: new Map(state.allWin).set(id, elmDraft)}
    // }),
    // delWin: (id: number) => set((state) => {
    //   const allWin = new Map(state.allWin);
    //   allWin.delete(id);

    //   const newArray = state.zIndexArr.slice();
    //   const index = newArray.indexOf(id);
    //   newArray.splice(index, 1);
    //   state.delSmallWin(id);
    //   return {allWin: allWin, zIndexArr: newArray}
    // }),
    addSmallWin: (id: number, name:string|undefined, min: boolean) => set((state) => {
      console.log(` id ${id}, name: ${name}, min: ${min}`)
      return {smallWin: new Map(state.smallWin).set(id, {name: name, min: min})}
    }),
    delSmallWin: (id: number) => set((state) => {
      const a = new Map(state.smallWin);
      a.delete(id)
      console.log(a);
      return {smallWin: a}
    }),
    zIndexChange: (id: number) => set((state) => {
      //console.log(state.zIndexArr);
      const zIndex1 = state.zIndexArr.indexOf(id);
      const newArray = state.zIndexArr.slice();
      newArray.splice(zIndex1, 1);
      //console.log(newArray)
      newArray.push(id);
      return {zIndexArr: newArray};
    
    }),
   
  
  })))