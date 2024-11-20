import React from 'react';
import styles from './styles.module.css'

export type IBtnInputProps = {
  zagolovok?: string;
  value?: boolean;
  onChange?: (val: boolean) => void;

}
export class CheckInput extends React.Component<IBtnInputProps/*,ISuperInputState*/> {
  //state: ISuperInputState;

  constructor(props: IBtnInputProps) {
    super(props);
  }

  changeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.onChange) this.props.onChange(event.target.checked)
  }
 

  render() {
    return (
      <div className={styles.container}>
        <label>
          <input type="checkbox" defaultChecked={this.props.value} onChange={this.changeInput} />
          {this.props.zagolovok}
        </label>
        </div>

    )
  }
}