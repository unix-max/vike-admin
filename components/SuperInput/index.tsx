import React from 'react';
import {className, styles } from './styles'

type ISuperInputProps = {
    zagolovok?: string;
    value?: string;
    onChange?: (val: string| number) => void
}
/*type ISuperInputState = {
    value: string ; 
  }
*/
  export class SuperInput extends React.Component<ISuperInputProps/*,ISuperInputState*/> {
    //state: ISuperInputState;
;
    constructor(props: ISuperInputProps) {
	    super(props);
    
      //this.state = props.value ? {value: props.value} : {value: ''};

    }

    changeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      //this.setState({value: event.target.value});

			if (this.props.onChange) this.props.onChange(event.target.value)
      //console.log(`render input ${this.props.value}`)
      //this.forceUpdate();
    } 
    render() {
      return (    
        <div>
          <span>{this.props.zagolovok}</span><br/>
          <input value={this.props.value} onChange={this.changeInput}/>
      
          </div>
      )
    }
}