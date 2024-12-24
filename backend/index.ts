import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

type Board = string[][];
let board: Board = [['', '', ''], ['', '', ''], ['', '', '']];
let currentPlayer: 'X' | 'O' = 'X';

type Winner = "X" | "O" | "Draw" | null;
const checkWinner = (): Winner => {
    const lines = [
        ...board,
        [board[0][0], board[1][0], board[2][0]],
        [board[0][1], board[1][1], board[2][1]],
        [board[0][2], board[1][2], board[2][2]],
        [board[0][0], board[1][1], board[2][2]],
        [board[0][2], board[1][1], board[2][0]],
    ];

    for (const line of lines) {
        if (line.every(cell => cell === 'X')) return 'X';
        if (line.every(cell => cell === 'O')) return 'O';
    }
    return board.flat().every(cell => cell) ? 'Draw' : null;
};

const computerMove = (): void => {
    const emptyCells: { row: number; col: number }[] = [];
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (!cell) emptyCells.push({ row: rowIndex, col: colIndex });
        });
    });

    if (emptyCells.length > 0) {
        const move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[move.row][move.col] = 'O';
    }
};

app.get("/board", (req: Request, res: Response) => {
    res.json({ board, currentPlayer });
});

app.post("/move", (req: Request, res: Response) => {
    const { row, col }: { row: number; col: number } = req.body;

    if (board[row][col] || checkWinner()) {
        res.status(400).json({ error: "Invalid move" });
        return
    }

    board[row][col] = currentPlayer;
    const winner: Winner = checkWinner();

    if (winner) {
        res.json({ board, winner });
        return
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (currentPlayer === 'O') {
        computerMove();
        currentPlayer = 'X';
    }

    res.json({ board, winner: checkWinner() });
});

app.post("/reset", (req: Request, res: Response) => {
    board = [['', '', ''], ['', '', ''], ['', '', '']];
    currentPlayer = 'X';
    res.json({ board, currentPlayer });
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
