import css from 'styled-jsx/css'

export const { className, styles } = css.resolve`
  
	.select {
    color: red;
	}

	div {
		display: inline-block;
		height: 550px;
		overflow: auto
	}

	table th {
	position: -webkit-sticky;
		position: sticky;
		top: 0;
	}

	table {
		border-collapse: collapse;
	}

	table th {
		background-color: #1976D2;
		color: #fff;
	}

	th,
	td {
		padding: 3px;
	}

	tr {
		color: #212121;
	}

	tr:nth-child(odd) {
		background-color: #BBDEFB;
	}
`