import React, { useState } from 'react';
import {className, styles } from './styles'


  interface ITabPanelProps {
    onTabChange?: (index: number) => void;
    children?: React.ReactElement<ITabItemProps>| React.ReactElement<ITabItemProps>[];
  }
  interface ITabPanelState {
    selectedTabIndex: number|null;
  }

export class TabPanel extends React.Component<ITabPanelProps, ITabPanelState>{
    constructor(props: ITabPanelProps) {
      super(props);
  
      this.state = {
        selectedTabIndex: React.Children.count(props.children)==0 ? null: 0 
      };
  
    }
    
    _renderTabs = () => {
      return React.Children.map(this.props.children, (child, i) => (
        <span className={`${className} 
          ${i === this.state.selectedTabIndex ? 'tab tab--selected' : 'tab'}`}
          onClick={() => {
            this.setState({ selectedTabIndex: i });
            if (this.props.onTabChange) this.props.onTabChange(i);
            if (child?.props.onSelect) child.props.onSelect()}}>
          <span className={`${className} tab__label`}>{child?.props.title}</span>
        </span>

        )
      )
    }
    
    _renderTabContent= () => {
      //console.log(this.state.selectedTabIndex)
      if (this.state.selectedTabIndex != null) 
      return React.Children.toArray(this.props.children)[this.state.selectedTabIndex];
 
    }
  
    render() {
        console.log('render tabs')
        if (this.state.selectedTabIndex === null) return 'nope';
      
      return (
        <div className={`${className} tab-panel`}>
          <div className={`${className} tab-panel__header`}>
            {this._renderTabs()}
          </div>
          <div className={`${className} tab-panel__content`}>
            {this._renderTabContent()}
          </div>
          {styles}
        </div>
     );
    }
  }
  
  interface ITabItemProps {
    title: string;
    children?: React.ReactNode;
    onSelect?: () => void;
  }
  export class TabItem extends React.Component<ITabItemProps> {
    constructor(props: ITabItemProps) {
      super(props);
  
    }
    render() {
      return (
        <>
          {this.props.children}
      </>
      )
      
    }

  }
  
  

  