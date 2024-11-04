import React from 'react'
import type { ReactElement, SyntheticEvent } from 'react';
import styles from './index.module.css'

export interface IMenuData {
    name: string,
    click?: React.MouseEventHandler<HTMLLIElement> | undefined ,
    in?: IMenuData[]
  }

export class Menu extends React.Component<{menuData: IMenuData[]}>{
    menuData: IMenuData[];
    constructor(props: {menuData: IMenuData[]}) {
        super(props);
        //console.log(props)
        this.menuData = props.menuData;

      }

  setVisible= (e: React.MouseEvent) => { 
    const ulElms = e.currentTarget.getElementsByTagName('ul')
    //console.log(ulElms);
    if( ulElms.length > 0 ) {
      ulElms[0].style.display = "block";

    }   
  }
    
  setHide= (e: React.MouseEvent) => { 
    const ulElms = e.currentTarget.getElementsByTagName('ul')
    //console.log(ulElms);
    if( ulElms.length > 0 ) {
      ulElms[0].style.display = "none";

    }   
  }
    ulVNode = (items: IMenuData[], step: boolean) => {
        return (  
          <ul {...step ? {className: styles.menu} : null} >
            
              {items.map((item, i) => {
                return (
                <li key={i}
                {...step ? {className: styles.main} : null}
                {...item.click ? {onClick: item.click}: undefined}
                {...{
                  onMouseEnter: this.setVisible,
                  onMouseLeave: this.setHide
                  }
                }>
                <span>{item.name}</span>
                {item.in ? this.ulVNode(item.in, false): null}
                </li> )
              } )
            
            }
          </ul>
          
        )
              }
            
        
    
    render(): ReactElement  {
        return (
          <div className={styles.container}>
          {this.ulVNode(this.menuData, true)}
          </div>
        ) 
        
    }
}