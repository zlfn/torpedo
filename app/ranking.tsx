
interface data {
    name: String,
    score: number,
    id: number,
}

export const ranking: Array<data> = []

export default function Ranking() {
    ranking.sort((a, b) => {return b.score - a.score});
    const rankList = ranking.map((data) => <li className="relative top-24 bottom-40 text-center font-Dalmoori border-t-12 border-b-20 leading-10" key={data.id}>{data.name + ": " + data.score}</li>)
    return <>
        {rankList}
    </>
}