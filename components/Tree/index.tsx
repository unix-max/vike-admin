import React, { Children, ReactComponentElement, useState } from 'react'
import {className, styles } from './styles'

export interface ITreeData {
  name: string;
  in?: ITreeItem[];
  onSelect?: (id: number) => void
  onEdit?: (id: number) => void
} 
export interface ITreeItem {
  id: number,
  name?: string,
  path?: string,
  in?: ITreeItem[]
}  
 
function TreeItem(props: {elm: ITreeItem}) {
  return (
    <>
      <li
        key={props?.elm?.id} 
        className={className}
        data-id={props?.elm?.id}
      >
      {props.elm.name}
      { props.elm?.in &&
        <TreeLevel items={props.elm.in} />
      }
      </li>
    </>
  )
}

function TreeLevel(props: {items: ITreeItem[]}) {
  //console.log('level')
  if(!props?.items?.length) return <h5>Loading</h5>
  return (
    <ul>
      {props.items.map((item) => <TreeItem key={item.id} elm={item} /> )}
    </ul>
    
  )
}

export class Tree extends React.Component<ITreeData> {
  treeRef: HTMLDivElement | null = null;
  selectId?: number;
  constructor(props: ITreeData) {
    super(props);
    
  }
  shouldComponentUpdate(nextProps:ITreeData) {
    //console.log(nextProps)
    //console.log(this.props.in === nextProps.in) 
    if(this.props.name != nextProps.name || this.props.in != nextProps.in) return true;
    return false;
}
  selectItem =(id: number) => {
    //console.log(id)
    if (typeof(this.selectId)=='number') this.treeRef?.querySelectorAll(`[data-id='${this.selectId}']`)[0]?.classList.remove("select");
    const selectElm = this.treeRef?.querySelectorAll(`[data-id='${id}']`)[0];
    selectElm?.classList.add("select");
    this.selectId = id;
  } 
  onSelectItem= (e: any)=> {
    const id: number = parseInt(e.target?.getAttribute('data-id'));
  //  console.log(typeof(id))
    if (typeof(id)=='number' && this.props.onSelect) this.props.onSelect(id);   
  }
  onEditItem= (e: any)=> {
    const id = e.target?.getAttribute('data-id');
    if (id && this.props.onEdit) this.props.onEdit(id);
    
  }
  render() {
    console.log(`Render Tree`);
    if (!this.props.in) return <h5>Loading</h5>
    return (
      <div ref={(elm)=> this.treeRef=elm} onClick={this.onSelectItem} onDoubleClick={this.onEditItem}>
        <span className={className} data-id="0">{this.props.name}</span>
        { this.props.in
        ? <TreeLevel items={this.props.in}  />
        : null
        }
       
        {styles}
      </div>
  
    )

  }
}

//export const Tree = React.memo(Tree1, (prevProps, nextProps) => {
 // console.log(prevProps === nextProps)
//if (prevProps === nextProps) return false;
//return true;
//});
