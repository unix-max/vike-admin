import React from 'react';
import styles from './styles.module.css'

type IBtnInputProps = {
  zagolovok?: string;
  value?: string;
  onChange?: (val: string| number) => void;
  onBtnClick?: () => void;
}
export class BtnInput extends React.Component<IBtnInputProps/*,ISuperInputState*/> {
  //state: ISuperInputState;

  constructor(props: IBtnInputProps) {
    super(props);
  }

  changeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    //this.setState({value: event.target.value});
    if (this.props.onChange) this.props.onChange(event.target.value)
  }
  btnClick = () => {
    if (this.props.onBtnClick) this.props.onBtnClick();
  }

  render() {
    return (
      <div >
        <span>{this.props.zagolovok}</span><br/>
        <div className={styles.container} >
          <input type="text" placeholder="Введите запрос..." value={this.props.value} onChange={this.changeInput}/>
          <button type="button" onClick={this.btnClick}>&#8230;</button> 
        </div>
        </div>

    )
  }
}