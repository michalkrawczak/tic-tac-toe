import React, { useEffect, useState } from "react";
import "./App.css";

type Board = string[][];

interface ApiResponse {
    board: Board;
    currentPlayer: string;
    winner?: string;
}

const API_URL = "http://localhost:4000";

const App: React.FC = () => {
    const [board, setBoard] = useState<Board>([['', '', ''], ['', '', ''], ['', '', '']]);
    const [winner, setWinner] = useState<string | null>(null);
    const [currentPlayer, setCurrentPlayer] = useState<string>("X");

    const fetchBoard = async () => {
        const response = await fetch(`${API_URL}/board`);
        const data: ApiResponse = await response.json();
        setBoard(data.board);
        setCurrentPlayer(data.currentPlayer);
    };

    const makeMove = async (row: number, col: number) => {
        if (board[row][col] || winner) return;
        const response = await fetch(`${API_URL}/move`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ row, col }),
        });

        const data: ApiResponse = await response.json();
        setBoard(data.board);
        setWinner(data.winner || null);
    };

    const resetGame = async () => {
        await fetch(`${API_URL}/reset`, { method: "POST" });
        setWinner(null);
        fetchBoard();
    };

    useEffect(() => {
        fetchBoard();
    }, []);

    return (
        <div className="App">
            <h1>Tic-Tac-Toe</h1>
            <div className="board">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cell, colIndex) => (
                            <div
                                key={colIndex}
                                className="cell"
                                onClick={() => makeMove(rowIndex, colIndex)}
                            >
                                {cell}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {winner && <h2>{winner === "Draw" ? "It's a Draw!" : `Player ${winner} Wins!`}</h2>}
            <button onClick={resetGame}>Reset</button>
        </div>
    );
};

export default App;
