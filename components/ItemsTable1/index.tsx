import React, { ReactComponentElement, useState, useEffect } from 'react'
//import {className, styles } from './styles'
import styles from './styles.module.css'

interface ITableKeys {
	head: string[],
	body: string[]
}
type ITableString = {
[key: string]: string | number| boolean| Date
}

interface IItemTableProps<T>{
	tableKeys: ITableKeys;
	tableData?: T[];
	selectId?: number;
	skey: string;
	onSelect?: (item: T) => void;
	onEdit?: (item: T) => void;
}

const THead = (props: {tHeadKeys: string[]}) => {	
  const header = props.tHeadKeys.map((item, index) => (
    <th key={index}>
      {item}
		</th>
		)
  );
	return <><thead><tr>{header}</tr></thead></>
}
function TString<T extends ITableString>(props: {tBodyKeys: string[], tableString: T, skey: string}) { 
	const tStr = props.tBodyKeys.map((item, index) => (	
		<td key={props.tableString[props.skey]+item}>
			{props.tableString[item] as string}
		</td>
	));
	return <>{tStr}</>;
}

function TBody<T extends ITableString>(props: {
		tBodyKeys: string[],
		tableData?: T[],
		selectId?: number,
		skey: string,
		onSelect?: (item: T) => void,
		onEdit?: (item: T) => void }
		) {

	const tData = props.tableData?.map((item) => (
		<tr key={item[props.skey] as string}
			data-id={item[props.skey] as string}
			className={styles.tr}
			onClick={() => {if (props.onSelect) props.onSelect(item)}}
			onDoubleClick={() => {if (props.onEdit) props.onEdit(item)}}
			
		>			
			<TString<T> tBodyKeys={props.tBodyKeys} tableString={item} skey={props.skey}/>
		</tr>
	))
	return <><tbody>{tData}</tbody></>
}

export class ItemTable<T extends ITableString> extends React.Component<IItemTableProps<T>> {
	tableRef: HTMLElement | null = null;
	selectId?: number;
	constructor(props: IItemTableProps<T>) {
		super(props);
	
	}

	selectItem =(id: number) => {
		console.log(id)
		if (this.selectId) this.tableRef?.querySelectorAll(`[data-id='${this.selectId}']`)[0]?.classList.remove(styles.select);
		const selectElm = this.tableRef?.querySelectorAll(`[data-id='${id}']`)[0];
		selectElm?.classList.add(styles.select);
		this.selectId = id;
	  } 

	render() {
		console.log(`Render Table`);
		return (
			<div className={styles.container}>
			<table  ref={(elm)=> this.tableRef=elm}>
				<THead tHeadKeys={this.props.tableKeys.head}/>
				<TBody
					tBodyKeys={this.props.tableKeys.body}
					tableData={this.props.tableData}
					skey={this.props.skey}
					onSelect={this.props.onSelect}
					onEdit={this.props.onEdit}
				/>
			</table>

			</div>
		)
	}

}

