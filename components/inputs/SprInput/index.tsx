import React from 'react';
import styles from './styles.module.css'

type ISprInputProps = {
  zagolovok?: string;
  value?: string;
  onBtnClick?: () => void;
}
export class SprInput extends React.Component<ISprInputProps/*,ISuperInputState*/> {
  //state: ISuperInputState;

  constructor(props: ISprInputProps) {
    super(props);
  }

  btnClick = () => {
    if (this.props.onBtnClick) this.props.onBtnClick();
  }

  render() {
    return (
      <div >
        <span>{this.props.zagolovok}</span><br/>
        <div className={styles.container} >
          <span>{this.props.value}</span>
          <button type="button" onClick={this.btnClick}>&#8230;</button> 
        </div>
        </div>

    )
  }
}