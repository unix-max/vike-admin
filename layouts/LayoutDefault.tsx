import React from "react";
//Оконная система
import { useWinStore } from '../pages/+client'
import { WinManager } from '../components/WinManager'
import { WinPanel } from "../components/WinPanel";
import {Menu, IMenuData} from '../components/Menu'
//Компоненты
import logoUrl from "../assets/logo.svg";
import { TovarSpr } from '@/components/spr/TovarSpr'
import { KlientSpr } from '../components/spr/KlientSpr'
import { SkladSpr } from "@/components/spr/SkladSpr";
import { CitySpr } from "@/components/spr/CitySpr";
import { FirmSpr } from "@/components/spr/FirmSpr";
import { OKSMSpr } from "@/components/spr/OKSMSpr";
import { BankSpr } from "@/components/spr/BankSpr";
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
        {name: "Банки", click: () => addNWin(BankSpr, {winId: Date.now()})},
        {name: "Города", click: () => addNWin(CitySpr, {winId: Date.now()})},
        {name: "Страны", click: () => addNWin(OKSMSpr, {winId: Date.now()})}
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
