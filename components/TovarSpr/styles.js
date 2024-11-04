import css from 'styled-jsx/css'

export default css`
.container {
    display: grid;
    gap: 5px;
    grid-template-columns: 250px auto;
    grid-template-rows: 30px auto auto;
}
  .buttons {
    border-style: solid;
    border-color: red;
    grid-column: 1 / 3;
    grid-row: 1 / 2;
  }
  .tree {
    
    border-style: solid;
    border-color: blue;
    grid-column: 1 / 2;
    grid-row: 2 / 3;
  }
  .table {
    grid-column: 2 /  3;
    grid-row: 2 / 3;
  }
  `