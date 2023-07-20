import {NextRequest, NextResponse} from "next/server";
import {squares} from "@/app/tictactoe/api/route";
import {ranking} from "../ranking";

let i = 0;
export async function POST(req: NextRequest) {
    const data = await req.json();

    ranking.push({name: data.name, score: data.score, id:i})
    i += 1;
    console.log(ranking)

    return new Response('NO', {status:200})
}
