'use client'

import '@/public/styles/ocean.css'
import '@/public/styles/index.css'
import '@/public/styles/game.css'

import Drawer from './drawer'
import Game from './game'

import {setTimeout} from "timers";
import {useEffect, useRef, useState} from "react";
import {durationScrollTo} from "@/public/scripts/scroll";
import {ranking} from "@/app/ranking";

export default function Home() {
    const [gamePlay, setGamePlay] = useState(false)

    const startButtonRef = useRef<HTMLButtonElement>(null);
    const gameRef = useRef<HTMLDivElement>(null);
    const scoreRef1 = useRef<HTMLParagraphElement>(null);
    const scoreRef2 = useRef<HTMLParagraphElement>(null);

    function handleClick() {
        if(window.innerWidth >= 1200) {
            setGamePlay(true);
        }
    }

    useEffect(()=>{
        updateButton()
        window.scrollTo({ top: 0});
        window.addEventListener("resize", updateButton);

        document.addEventListener("keydown", function (e) {
            if ( e.ctrlKey &&
                (e.key == "=" || e.key == "+" ||
                    e.key == "-" || e.key == "_")
            ) {
                e.preventDefault();
            }
        });
        document.addEventListener(
            "wheel",
            function (e) {
                if (e.ctrlKey) {
                    e.preventDefault();
                }
            },
            {
                passive: false
            }
        );
    }, [])

    function updateButton() {
        const button = startButtonRef.current!;
        button.disabled = window.innerWidth < 1200;
    }

    let score = 0;
    //const scoreText = String(score).padStart(9, '0');
    const scoreText = String(score);

    ///DEBUG
    function endGame() {
        durationScrollTo(0, 2000, 2);
        setTimeout(()=>(setGamePlay(false)), 2000);
    }

    function changeScore(s : number) {
        score = s;
        //scoreRef1.current!.textContent = String(score).padStart(9, '0');
        //scoreRef2.current!.textContent = String(score).padStart(9, '0');
        scoreRef1.current!.textContent = String(score);
        scoreRef2.current!.textContent = String(score);
    }

    function GamePlay() {
        if(gamePlay) {
            return <>
                <div ref={gameRef} className="absolute gameDiv">
                    <Game gameRef={gameRef} score={score} addScore={(a:number)=>{changeScore(score+=a)}} endGame={()=>endGame()}/>
                </div>
            </>
        }
        else {
            return <>
                <div ref={gameRef} className="absolute gameDiv"></div>
                <p className="fixed text-1xl right-3 top-3 mobileOff font-DOS">SPACE to launch torpedo<br/>ARROW to move submarine</p>
            </>
        }
    }

    return (
        <>
            <link rel="stylesheet" href="https://unpkg.com/keyboard-css@1.2.4/dist/css/main.min.css" />
            <p className="absolute top-64 right-1/2 text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-center z-0 font-Sam3 centerLogo">Torpedo</p>
            <div className="absolute top-0 w-full scoreDiv">
                <p ref={scoreRef1} className="sticky z-10 text-center text-blue-400 text-opacity-50 font-NeoDung text-4xl mobileOff score">{scoreText}</p>
                <p ref={scoreRef2} className="sticky -z-4 text-center text-white font-NeoDung text-4xl mobileOff score">{scoreText}</p>
            </div>
            <div className="absolute -z-5 wave"></div>
            <div className="absolute -z-3 wave"></div>
            <div className="absolute -z-1 ocean">
            </div>
            <div className="relative top-96 content">
                <p className="absolute top-52 text-red-500 font-NeoDung text-center mobileOn">가로 화면에서 플레이 가능합니다.</p>

                {/*material tailwind*/}
                <button
                    ref={startButtonRef}
                    className="z-11 absolute top-32 middle none center rounded-lg bg-blue-800 py-3 text-white shadow-md shadow-blue-800/20 transition-all hover:shadow-lg hover:shadow-blue-800/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none button"
                    data-ripple-light="true"
                    onClick={()=>handleClick()}>
                    PLAY
                </button>
            </div>
            <GamePlay/>
        </>
    );
}
