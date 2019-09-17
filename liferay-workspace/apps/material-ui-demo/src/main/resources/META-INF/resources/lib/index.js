import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';

let config;

class Square extends React.Component {
	render() {
		return (
			<Button variant="contained" color="primary" onClick={() => this.props.onClick()}>
				{this.props.value}
			</Button>
		);
	}
}

class Board extends React.Component {
	constructor() {
		super();
		this.state = {
			squares: Array(9).fill(null),
			xIsNext: true,
		};
	}

	handleClick(i) {
		const squares = this.state.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? config.X : config.O;
		this.setState({ squares: squares, xIsNext: !this.state.xIsNext });
	}

	renderSquare(i) {
		return (
			<Square
				value={this.state.squares[i]}
				onClick={() => this.handleClick(i)}
			/>
		);
	}

	render() {
		const winner = calculateWinner(this.state.squares);
		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? config.X : config.O);
		}

		return (
			<div>
				<div className="status">{status}</div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	render() {
		return (
			<div>
				<div className="game">
					<div className="game-board">
						<Board />
					</div>
					<div className="game-info">
						<div>{/* status */}</div>
						<ol>{/* TODO */}</ol>
					</div>
				</div>
				<Switches />
			</div>
		);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (
			squares[a] &&
			squares[a] === squares[b] &&
			squares[a] === squares[c]
		) {
			return squares[a];
		}
	}
	return null;
}

function Switches() {
	const [state, setState] = React.useState({
		checkedA: true,
		checkedB: true,
	});

	const handleChange = name => event => {
		setState({ ...state, [name]: event.target.checked });
	};

	return (
		<div>
			<Switch
				checked={state.checkedA}
				onChange={handleChange('checkedA')}
				value="checkedA"
				inputProps={{ 'aria-label': 'secondary checkbox' }}
			/>
			<Switch
				checked={state.checkedB}
				onChange={handleChange('checkedB')}
				value="checkedB"
				color="primary"
				inputProps={{ 'aria-label': 'primary checkbox' }}
			/>
			<Switch value="checkedC" inputProps={{ 'aria-label': 'primary checkbox' }} />
			<Switch disabled value="checkedD" inputProps={{ 'aria-label': 'disabled checkbox' }} />
			<Switch disabled checked value="checkedE" inputProps={{ 'aria-label': 'primary checkbox' }} />
			<Switch
				defaultChecked
				value="checkedF"
				color="default"
				inputProps={{ 'aria-label': 'checkbox with default color' }}
			/>
		</div>
	);
}

export default function (elementId, liferayConfig) {
	config = liferayConfig;
	ReactDOM.render(<Game />, document.getElementById(elementId));
}