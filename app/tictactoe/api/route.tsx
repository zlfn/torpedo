import {type NextRequest, NextResponse} from 'next/server'

export const squares = Array(9).fill('');
let xIsNext = true

export async function GET(req: NextRequest) {
    const winner = calculateWinner(squares);
    return NextResponse.json({winner:winner, turn:xIsNext, squares})
}

export async function POST(req: NextRequest) {
    const data = await req.json();
    if (squares[data.id])
        return new Response('NO', {status:200})
    if (squares[data.id] || calculateWinner(squares))
        return new Response('NO', {status:200})

    const nextSquares = squares.slice();
    if (xIsNext) {
        squares[data.id] = 'X'
    } else {
        squares[data.id] = 'O'
    }
    xIsNext = !xIsNext;
    const winner = calculateWinner(squares);
    return NextResponse.json({winner:winner, turn:xIsNext, squares})
}

function calculateWinner(squares: Array<string>) {
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