import React, { ReactComponentElement, useState, useEffect } from 'react'
import {className, styles } from './styles'

interface ITableKeys {
	head: string[],
	body: string[]
}
export interface ITableString {
	id: number;
	[key: string]: number | string
}

interface IItemTableProps {
	tableKeys: ITableKeys;
	tableData?: ITableString[];
	selectId?: number;
	onSelect?: (item: number) => void;
	onEdit?: (id: ITableString) => void;
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
const TString = (props: {tBodyKeys: string[], tableString: ITableString}) => { 
	const tStr = props.tBodyKeys.map((item, index) => (	
		<td key={props.tableString.id+item}>
			{props.tableString[item]}
		</td>
	));
	return <>{tStr}</>;
}

const TBody = (props: {
		tBodyKeys: string[],
		tableData?: ITableString[],
		selectId?: number,
		onSelect?: (id: number) => void,
		onEdit?: (itam: ITableString) => void }
		) => {

	const tData = props.tableData?.map((item) => (
		<tr key={item.id}
			data-id={item.id}
			className={className}
			onClick={() => {if (props.onSelect) props.onSelect(item.id)}}
			onDoubleClick={() => {if (props.onEdit) props.onEdit(item)}}
			
		>			
			<TString tBodyKeys={props.tBodyKeys} tableString={item} />
		</tr>
	))
	return <><tbody>{tData}</tbody></>
}

export class ItemTable extends React.Component<IItemTableProps> {
	tableRef: HTMLElement | null = null;
	selectId?: number;
	constructor(props: IItemTableProps) {
		super(props);
	
	}

	selectItem =(id: number) => {
		console.log(id)
		if (this.selectId) this.tableRef?.querySelectorAll(`[data-id='${this.selectId}']`)[0]?.classList.remove("select");
		const selectElm = this.tableRef?.querySelectorAll(`[data-id='${id}']`)[0];
		selectElm?.classList.add("select");
		this.selectId = id;
	  } 

	render() {
		console.log(`Render Table`);
		return (
			<div className={className}>
			<table className={className}  ref={(elm)=> this.tableRef=elm}>
				<THead tHeadKeys={this.props.tableKeys.head}/>
				<TBody
					tBodyKeys={this.props.tableKeys.body}
					tableData={this.props.tableData}
					onSelect={this.props.onSelect}
					onEdit={this.props.onEdit}
				/>
			</table>
	
			{styles}
			</div>
		)
	}

}

/*
export function IemTable(props: IIemTable) {
	console.log(`Render ItemTable ${props.selectId}`);
	console.log(props.tableData);
	return (
		<div className={className}>
		<table className={className}>
			{tHead(props.tableKeys.head)}
			{tBody(props.tableKeys.body, props.tableData, props.selectId, props.onSelect, props.onEdit)}
		</table>

		{styles}

		</div>
	)
}
//,(prevProps, nextProps) => {
	//if (prevProps.selectId == nextProps.selectId) return true;
//	return false;
	/*
	возвращает true, если nextProps рендерит
	тот же результат что и prevProps,
	иначе возвращает false
	*/
 // })

