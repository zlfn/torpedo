'use client'
import './tictactoe.css'
import {Square, LoadingSquare} from './square'
import {useEffect, useState} from "react";
import useSWR from 'swr'
import {squares} from "@/app/tictactoe/api/route";

export default function Game() {
    return (
        <div className={"game"}>
            <div className={"game-board"}>
                <Board />
            </div>
            <div className={"game-info"}>
                <ol>{/*TODO*/}</ol>
            </div>
        </div>
    )
}

interface BoardInfo {
    squares: Array<string>
    turn: boolean
    winner: string
}
function Board() {
    const fetcher = (url:string) => fetch(url).then((res) => res.json());
    const { data , error, isLoading, mutate} = useSWR<BoardInfo>('/tictactoe/api', fetcher,
        {refreshInterval: 1000});

    async function handleClick(i: number) {
        if (data) {
            const newData:BoardInfo = {
                turn : !data.turn,
                winner: data.winner,
                squares:data.squares.map((c, t)=> {
                    if(i==t) return data.turn ? 'X':'O';
                    else return c;
                })
            }

            mutate(newData, {revalidate:false});

            fetch('/tictactoe/api', {
                method: 'POST',
                body: JSON.stringify({id: i})
            }).then(()=>{
                mutate(newData, true);
            })
        }
    }

    async function resetGame() {
        if(data) {
            const newData:BoardInfo = {
                turn : data.turn,
                winner: data.winner,
                squares: Array(9).fill('')
            }

            mutate(newData,false);

            fetch("/tictactoe/api/reset").then(() => {
                mutate(newData,true);
            })
        }
    }

    if(isLoading) {
        return <>
            <div className={"board-row"}>
                <LoadingSquare  />
                <LoadingSquare  />
                <LoadingSquare  />
            </div>
            <div className={"board-row"}>
                <LoadingSquare  />
                <LoadingSquare  />
                <LoadingSquare  />
            </div>
            <div className={"board-row"}>
                <LoadingSquare  />
                <LoadingSquare  />
                <LoadingSquare  />
            </div>
        </>

    }
    else {
        let status;
        if(!data) return
        if (data.winner) {
            status = "Winner: " + data.winner;
        } else {
            status = "Next player: " + (data.turn ? "X" : "O");
        }
        return <>
            <div className={"status"}>{status}</div>
            <div className={"board-row"}>
                <Square onSquareClick={async ()=> handleClick(0)} value={data.squares[0]} />
                <Square onSquareClick={async ()=> handleClick(1)} value={data.squares[1]} />
                <Square onSquareClick={async ()=> handleClick(2)} value={data.squares[2]} />
            </div>
            <div className={"board-row"}>
                <Square onSquareClick={async ()=> handleClick(3)} value={data.squares[3]} />
                <Square onSquareClick={async ()=> handleClick(4)} value={data.squares[4]} />
                <Square onSquareClick={async ()=> handleClick(5)} value={data.squares[5]} />
            </div>
            <div className={"board-row"}>
                <Square onSquareClick={async ()=> handleClick(6)} value={data.squares[6]} />
                <Square onSquareClick={async ()=> handleClick(7)} value={data.squares[7]} />
                <Square onSquareClick={async ()=> handleClick(8)} value={data.squares[8]} />
            </div>
            <button className={"text-sky-500"} onClick={async ()=>resetGame()}>Reset Game</button>
        </>
    }
}

