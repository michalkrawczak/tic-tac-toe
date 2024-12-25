import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

type Cell = 'X' | 'O' | '';
type Board = Cell[][];
type ComputerMove = 'random' | 'optimal';
let board: Board = [['', '', ''], ['', '', ''], ['', '', '']];
let currentPlayer: 'X' | 'O' = 'X';
let computerMove: ComputerMove = 'random'

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

/**
 * Makes a random move for the computer player
 */
const randomComputerMove = (): void => {
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

function findSide(emptyCells: { row: number; col: number }[]) {
    return emptyCells.find(cell => Math.abs(cell.row - cell.col) === 1);
}

function findCenter(emptyCells: { row: number; col: number }[]) {
    return emptyCells.find(cell => cell.row === 1 && cell.col === 1);
}

function findCorners(emptyCells: { row: number; col: number }[]) {
    return emptyCells.filter(cell => Math.abs(cell.row - cell.col) === 2 || Math.abs(cell.row - cell.col) === 0);
}

/**
 * Makes an optimal move for the computer player:
 * * If the computer can win, it makes that move
 * * If the player can win, it blocks that move
 * * Otherwise, it chooses the more valuable field (center > corner > side)
 */
const optimalComputerMove = (): void => {
    const emptyCells: { row: number; col: number }[] = [];
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (!cell) emptyCells.push({ row: rowIndex, col: colIndex });
        });
    });

    /**
     * Check if the computer can win
     */
    for (const move of emptyCells) {
        const [row, col] = [move.row, move.col];
        board[row][col] = 'O';
        if (checkWinner() === 'O') return;
        board[row][col] = '';
    }

    /**
     * Check if the player can win
     */
    for (const move of emptyCells) {
        const [row, col] = [move.row, move.col];
        board[row][col] = 'X';
        if (checkWinner() === 'X') {
            board[row][col] = 'O';
            return;
        }
        board[row][col] = '';
    }

    /**
     *  Special case: if player has opposite corners (0,0 and 2,2 or 0,2 and 2,0), and computer is in the center (1,1),
     *  and there are no more occupied cells, then:
     *  the computer should choose a side to block the player from winning. (not the corner - that's actually a losing position)
     */
    if (emptyCells.length === 6) {
        // case 1: (0,0) and (2,2)
        if (board[0][0] === 'X' && board[2][2] === 'X' && board[1][1] === 'O') {
            const side= findSide(emptyCells);
            if (side) {
                board[side.row][side.col] = 'O';
                return;
            }
        }
        // case 2: (0,2) and (2,0)
        if (board[0][2] === 'X' && board[2][0] === 'X' && board[1][1] === 'O') {
            const side= findSide(emptyCells);
            if (side) {
                board[side.row][side.col] = 'O';
                return;
            }
        }
    }

    /**
     * Choose the best move: first the center, then the corners, and finally the sides
     */
    const center = findCenter(emptyCells);
    if (center) {
        board[center.row][center.col] = 'O';
        return;
    }

    /**
     * Corners are the next best move. Corners are: (0, 0), (0, 2), (2, 0), (2, 2)
     */
    const corners = findCorners(emptyCells);
    if (corners.length > 0) {
        const corner = corners[Math.floor(Math.random() * corners.length)];
        board[corner.row][corner.col] = 'O';
        return;
    }

    /**
     * If none of the above cases match, then we have only sides left.
     */
    const sides = emptyCells
    const side = sides[Math.floor(Math.random() * sides.length)];
    board[side.row][side.col] = 'O';
}

/**
 * Makes a move for the computer player
 */
const makeComputerMove = (): void => {
    if (computerMove === 'random') {
        randomComputerMove();
    } else {
        optimalComputerMove();
    }
}

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
        makeComputerMove();
        currentPlayer = 'X';
    }

    res.json({ board, winner: checkWinner() });
});

app.post("/reset", (req: Request, res: Response) => {
    board = [['', '', ''], ['', '', ''], ['', '', '']];
    currentPlayer = 'X';
    res.json({ board, currentPlayer });
});

/**
 * Toggles between the random and optimal computer move
 */
app.post("/mode/toggle", (req: Request, res: Response) => {
    const {mode}: { mode: 'random' | 'optimal' } = req.body;
    if (mode === 'random') {
        computerMove = 'random';
    } else {
        computerMove = 'optimal';
    }
    res.json({message: `Computer move set to ${mode}`});
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
