import React from "react";
//Оконная система
import { useWinStore } from '../pages/+client'
import { WinManager } from '../components/WinManager'
import { WinPanel } from "../components/WinPanel";
import {Menu, IMenuData} from '../components/Menu'
//Компоненты
import logoUrl from "../assets/logo.svg";
import { TovarSpr } from '@/components/TovarSpr'
import { KlientSpr } from '../components/KlientSpr'
import { SkladSpr } from "@/components/SkladSpr";
import { FirmSpr } from "@/components/FirmSpr";
//Стили
//import "./style.css";

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  const [addWin, addNWin] = useWinStore((state: any)  => [state.addWin, state.addNWin])

  let data: IMenuData[] = [
    {name: "Файл", 
    in: [
      {name: "Клиент",
      click: () => {
        
        addNWin(KlientSpr, {winId: Date.now()})
      }
    },
    {name: "Товар",
    click: () => {
      
      addNWin(TovarSpr, {winId: Date.now()})
    }
  },
      {name: "Открыть"}
    ]},
    {name: "Справочник", in: [
      {name: "Наши", in: [
        {name: "Фирмы",
          click: () => {
        
            addNWin(FirmSpr, {winId: Date.now()})
        }},
        {name: "Налоги", in:[
          {name: "НДС"},
          {name: "НП"}
        ]},
        {name: "Валюты"},
        {name: "Склады", click: () => addNWin(SkladSpr, {winId: Date.now()})},
        {name: "Страны"}
        ]},
        { name: "Клиент", click: () => addNWin(KlientSpr, {winId: Date.now()})},
      
        { name: "Товар", click: () => addNWin(TovarSpr, {winId: Date.now()})},
      ]
    }
    ];
 
  return (
    <div>
    <Menu menuData={data} />
    
      {/* <Content>{children}</Content> */}
      <WinManager />
      <WinPanel />
    </div>
  );
}
