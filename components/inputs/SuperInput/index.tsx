import React from 'react';
import styles from './styles.module.css'


type ISuperInputProps = {
    zagolovok?: string;
    value?: string | number;
    type?: 'text' | 'number';
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
        <div >
          <label>{this.props.zagolovok}</label><br/>
          <div className={styles.container}>
            {this.props.type ? 
              <input type={this.props.type} defaultValue={this.props.value} onChange={this.changeInput}/> :
              <input  defaultValue={this.props.value} onChange={this.changeInput}/>
            }
            
          </div>
      
        </div>
      )
    }
}