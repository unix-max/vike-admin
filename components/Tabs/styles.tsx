import css from 'styled-jsx/css'

export const { className, styles } = css.resolve`
  

.tab-panel__header {
  font-family: 'Trebuchet MS';
  font-size: 12px;
  position: relative;
  top: 1px
}

.tab-panel__content {
  background-color: #D5D5D5;
  border: 1px solid #9099A2;
  height: 400px;
} 

.tab {
  background-color: #D5D5D5;
  border: 1px solid #9099A2;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  color: #96858F;
  cursor: pointer;
  display: inline-block;
  padding: 6px 24px;
  position: relative;
  text-transform: uppercase;
  z-index: 0;
}

.tab:nth-child(n+2) {
    margin-left: -8px;
}

.tab:hover {
  color: #6D7993;
}

.tab--selected {
  border-bottom: 1px solid #D5D5D5;
  color: #6D7993;
  font-size: 14px;
  font-weight: bold;
  padding-top: 6px;
  z-index: 1;
}

`