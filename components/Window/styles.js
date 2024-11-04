import css from 'styled-jsx/css'

export const { className, styles } = css.resolve`
  
.modal{
    width:100%;
    min-height:100%;
    background-color: rgba(0,0,0,0.5);
    overflow:hidden;
    position:fixed;
    top:0px;
}
    .win {
        border: solid blue 1px;
        background-color: #f7f7f7;
        min-height: 300px;
        top:30px;
        min-width: 600px;
        position: fixed;
    }
    .header {
        display: grid;
        grid-template-columns: auto 55px;
        grid-template-rows: auto;
        
        background: linear-gradient(90deg, blue, white 70%);
        color: white;
        height: 18px;
    }
    .headerText {
        border: solid red 1px;
       display: block;
        grid-column: 1 / 2;
        grid-row: 1 / 2;
    }
    .btnBox {
        border: solid green 1px;
         grid-column: 2 / 3;
        grid-row: 1 / 2;
        justify-self: end;
        
    }
    `