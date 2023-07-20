'use client'
import React, {MouseEventHandler} from 'react';
export function Square({value, onSquareClick}:{value:string, onSquareClick: () => void}) {
    return <button className={"square"} onClick={onSquareClick}>
        {value}
    </button>
}

export function LoadingSquare() {
    return <button className={"squareLoading"}></button>
}
