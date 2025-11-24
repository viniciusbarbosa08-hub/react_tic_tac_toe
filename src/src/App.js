import React, { useState } from 'react';
import './App.css';

const Square = (props) => {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
};

const Board = (props) => {
    const renderSquare = (i) => {
        return (
            <Square 
                value={props.squares[i]} 
                onClick={() => props.onClick(i)} 
            />
        );
    };

    return (
        <div className="d-flex flex-column align-items-center">
            <div className="board-row">
                {renderSquare(0)}{renderSquare(1)}{renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}{renderSquare(4)}{renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}{renderSquare(7)}{renderSquare(8)}
            </div>
        </div>
    );
};

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

const App = () => {
    const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);

    const handleClick = (i) => {
        const historyPoint = history.slice(0, stepNumber + 1);
        const current = historyPoint[historyPoint.length - 1];
        const squares = [...current.squares];

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = xIsNext ? 'X' : 'O';
        setHistory([...historyPoint, { squares: squares }]);
        setStepNumber(historyPoint.length);
        setXIsNext(!xIsNext);
    };

    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    };

    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
        const desc = move ? 
            'Ir para a jogada #' + move : 
            'Ir para o início do jogo';
        const btnClass = move === stepNumber ? "btn btn-primary btn-sm mb-1" : "btn btn-outline-secondary btn-sm mb-1";

        return (
            <li key={move} style={{listStyle: 'none'}}>
                <button className={btnClass} onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    let status;
    if (winner) {
        status = 'Vencedor: ' + winner;
    } else if (stepNumber === 9) {
         status = 'Empate!';
    } else {
        status = 'Próximo jogador: ' + (xIsNext ? 'X' : 'O');
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 text-center">
                    <h2 className="mb-4">Jogo da Velha</h2>
                    <div className="status alert alert-info">{status}</div>
                    <div className="game-board">
                        <Board 
                            squares={current.squares} 
                            onClick={(i) => handleClick(i)} 
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <h4 className="mt-4 mt-md-0">Histórico de Jogadas</h4>
                    <ul className="ps-0">
                        {moves}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default App;
