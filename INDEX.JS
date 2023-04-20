import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

/*The Square functional component is a controlled component. It receives value props from the Board component and 
  informs the board component when the're clicked.*/
function Square(props) {
  return (
    /*When a square is clicked, it calls the function onClick.*/
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

/*The Board component is a controlled component. It receives props values from the Game component.*/
class Board extends React.Component {
  /*The renderSquare method reads from the squares array, each square receives a value prop that is either 
    'X', 'O', or null.*/
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
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

/*The Game component is a parent component. It contains the initial state within its constructor, and all other sequential game's 
  states as the game develops. It passes props on to its child component.*/
class Game extends React.Component {
  /*The initial state for the Game component is located within its constructor.*/
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    /*Const history ensures that if we use the option to "travel back in time" and then make a new move from that point, we throw 
      away all "the future history" steps that would become incorrect.*/
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    /*Using slice to create a new copy of the squares array after every move allows to store every past 
      version of the squares array and navigate between the players moves that have already happened. The past squares 
      arrays are stored in the history array.*/
    const squares = current.squares.slice();
    /*The handeClick function returns early by ignoring a click if someone has won the game or if a Square is already filled.*/
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    /*Each time a player moves, xIsNext is flipped to determine which player goes next and the game's state is saved.*/
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        /*The concat method is used as it doesn't mutate the original array.*/
        {
          squares: squares
        }
      ]),
      /*The stepNumber's state ensures to not get stuck showing the same move after a new one has been made.*/
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      /*stepNumber is changed to a number, if this number is even, xIsNext evaluates true.*/
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    /*The render function uses the most recent history entry to determine and display the game’s status.*/
    const history = this.state.history;
    /*Const current renders the currently selected move according to stepNumber. After a click on any step in the game's history, 
      the board immediately updates to show what the board looked like when that step occurred.*/
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    /*The map method maps history of moves represented as buttons on the screen. It displays a list of buttons to jump to past 
      moves. There is created a list item for each move in the game's history, and it contains a button element. 
      The button has onClick handler to call the jumpTo method.*/
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Reset";
      return (
        /*Added key={move} adds to each move an unique ID associated with it. Index is used as a key.*/
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner is the player: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

  

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <h5 align="center"> Winner: None </h5>


      
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}




ReactDOM.render(<Game />, document.getElementById("root"));

// ========================================

/*The function checks for a winner and returns 'X', 'O', or null. It is called in the Games's render function to check if a player 
  has won.*/
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
