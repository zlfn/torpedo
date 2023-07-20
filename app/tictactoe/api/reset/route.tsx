import {type NextRequest, NextResponse} from 'next/server'
import {squares} from "@/app/tictactoe/api/route";

export async function GET(req: NextRequest) {
    for(let i:number = 0; i < squares.length; i++)
        squares[i] = ''
    return new Response('', {status:200})
}
