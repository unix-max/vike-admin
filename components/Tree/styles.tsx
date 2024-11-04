import css from 'styled-jsx/css'

export const { className, styles } = css.resolve`
  

.select {
  color: red;
}
li:not(.select) {
  color: black;
}

`