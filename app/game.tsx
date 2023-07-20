'use client'
import '@/public/styles/game.css'
import '@/public/styles/shake.css'

import {durationScrollTo} from '@/public/scripts/scroll'

import {RefObject, useEffect, useRef} from "react";
import {isMobileSafari} from 'react-device-detect';

import {Submarine} from "@/game/submarine";
import {GreenFish} from "@/game/fish/greenFish";
import {Torpedo} from "@/game/torpedo";
import {Explode} from "@/game/explode";
import {Bubble} from "@/game/bubble";
import {Heart} from "@/game/ui/heart";
import {MintFish} from "@/game/fish/mintFish";
import {Color, Fish, fishScore} from "@/game/fish";
import {YellowFish} from "@/game/fish/yellowfish";
import {PurpleFish} from "@/game/fish/purplefish";
import {VirdianFish} from "@/game/fish/virdianFish";
import {ForestFish} from "@/game/fish/forestFish";
import {JellyFish} from "@/game/fish/jellyFish";
import {TorpedoBar} from "@/game/ui/torpedoBar";
import {ImagePreload} from "@/game/image";
import {Ability, Item} from "@/game/item";
import {TorpedoUpgrade} from "@/game/item/torpedoUpgrade";
import {HeartRestore} from "@/game/item/heartRestore";
import {SpeedUp} from "@/game/item/speedUp";
import {FloatUp} from "@/game/item/floatUp";

export interface Input {
    right : boolean;
    left : boolean;
    up : boolean;
    down : boolean;
    space : boolean;
}

export default function Game({gameRef, score, addScore, endGame}: {gameRef: RefObject<HTMLDivElement>, score:number, addScore:Function, endGame:Function}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let height = 0;
    const imagePre = new ImagePreload();

    let lastHitTime = new Date().getTime();
    const reinforceTime = 2000;

    //시작시 즉시 장전
    let lastLaunchTime = new Date().getTime();
    let reloadTime = 1500;
    let hp = 3;


    let sub: Submarine | null = null;

    let keyboardMode = true;
    let TabMode = false;
    let input: Input = {right:false, left:false, up:false, down:false, space:false};

    //GreenFish////////////////////
    const gf: Array<Fish> = [];
    function generateGreenfish() {
        gf.push(new GreenFish(canvasRef, imagePre));
    }
    function drawGreenfish() {
        for(let i = 0; i < gf.length; i++) {
            if(gf[i]) {
                gf[i].draw();
            }
        }
    }
    function updateGreenfish() {
        for(let i = 0; i < gf.length; i++) {
            if(gf[i]) {
                gf[i].move();
                if(gf[i].checkAttack(sub!)) {
                    getDamage(10);
                }
                if(gf[i].isOut()) delete gf[i];
            }
        }
    }

    //MintFish////////////////////
    function generateMintfish() {
        gf.push(new MintFish(canvasRef, imagePre));
    }

    //YellowFish///////////////////
    function generateYellowfish() {
        gf.push(new YellowFish(canvasRef, imagePre));
    }

    function generatePurplefish() {
        gf.push(new PurpleFish(canvasRef, imagePre));
    }

    function generateVirdianfish() {
        gf.push(new VirdianFish(canvasRef, imagePre));
    }

    function generateForestfish() {
        gf.push(new ForestFish(canvasRef, imagePre));
    }

    function generateJellyfish() {
        gf.push(new JellyFish(canvasRef, imagePre));
    }

    //Item/////////////
    const it: Array<Item> = []
    function generateTorpedoUp(f:Fish) {
        it.push(new TorpedoUpgrade(canvasRef, f, imagePre));
    }
    function generateHeartRestore(f:Fish) {
        it.push(new HeartRestore(canvasRef, f, imagePre));
    }

    function generateSpeedUp(f:Fish) {
        it.push(new SpeedUp(canvasRef, f, imagePre));
    }

    function generateFloatUp(f:Fish) {
        it.push(new FloatUp(canvasRef, f, imagePre));
    }

    function updateItem() {
        for(let i = 0; i < it.length; i++) {
            if(it[i]) {
                it[i].move();
                if(it[i].checkAttain(sub!)) {
                    if(it[i].ability == Ability.TorpedoUp) {
                        reloadTime *= 0.9;
                        delete it[i]
                    }
                    else if(it[i].ability == Ability.HeartRestore) {
                        if(hp < 3) hp += 1;
                        ht[hp-1].enabled = true;
                        delete it[i]
                    }
                    else if(it[i].ability == Ability.SpeedUp) {
                        sub!.max_speed *= 1.05;
                        sub!.acceleration *= 1.03;
                        delete it[i]
                    }
                    else if(it[i].ability == Ability.FloatUp) {
                        sub!.max_float *= 1.05;
                        sub!.buoyancy *= 1.03;
                        delete it[i]
                    }
                }
                if(it[i] && it[i].isOut()) {delete it[i];}
            }
        }
    }
    function drawItem() {
        for(let i = 0; i < it.length; i++) {
            if(it[i]) {
                it[i].draw();
            }
        }
    }

    function generateItem(f : Fish) {
        if(f.color == Color.GREEN || f.color == Color.VIRDIAN || f.color == Color.FOREST) {
            if(Math.random() < 0.03) {
                generateHeartRestore(f);
            }
            else if(Math.random() < 0.03) {
                generateTorpedoUp(f);
            }
        }
        else if(f.color == Color.YELLOW || f.color == Color.PURPLE) {
            if(Math.random() < 0.3) {
                generateTorpedoUp(f);
            }
        }
        else if(f.color == Color.MINT) {
            if(Math.random() < 0.5) {
                generateSpeedUp(f);
            }
        }
        if(f.color == Color.JELLY) {
            if(Math.random() < 0.2) {
                generateFloatUp(f)
            }
        }
    }


    //Torpedo///////////////////////
    const tp: Array<Torpedo> = [];
    function generateTorpedo() {
        tp.push(new Torpedo(sub!, generateBubble, imagePre))
    }
    function updateTorpedo() {
        for(let i = 0; i < tp.length; i++) {
            if(tp[i]) {
                tp[i].move();
                for(let j = 0; j < gf.length; j++) {
                    if(gf[j]) {
                        if(tp[i].checkAttack(gf[j])) {
                            shakeScreen(300);
                            generateExplode(tp[i]);
                            delete tp[i];
                            break;
                        }
                    }
                }
                if(tp[i] && tp[i].isOut()) {delete tp[i];}
            }
        }
    }
    function drawTorpedo() {
        for(let i = 0; i < tp.length; i++) {
            if(tp[i]) {
                tp[i].draw();
            }
        }
    }

    //Explode///////////
    const ex: Array<Explode> = []
    function generateExplode(tor: Torpedo) {
        ex.push(new Explode(tor, generateFrontBubble, imagePre))
    }
    function updateExplode() {
        for(let i = 0; i < ex.length; i++) {
            if(ex[i]) {
                for(let j = 0; j < gf.length; j++) {
                    if(gf[j] && !ex[i].hit.includes(j)) {
                        if(ex[i].checkAttack(gf[j])) {
                            if(gf[j].hp > 1) {
                                gf[j].hp -= 1
                                ex[i].hit.push(j);
                            } else {
                                score += fishScore[gf[j].color]
                                addScore(fishScore[gf[j].color])
                                ex[i].addBubble(gf[j])
                                generateItem(gf[j]);
                                delete gf[j];
                            }
                        }
                    }
                }
                if(ex[i].isOut()) {delete ex[i];}
            }
        }
    }
    function drawExplode() {
        for(let i = 0; i < ex.length; i++) {
            if(ex[i]) {
                ex[i].draw();
            }
        }
    }

    //Bubble//////////////
    const bb: Array<Bubble> = []; //Back Bubble
    const fb: Array<Bubble> = []; //Front Bubble
    function generateBubble(x:number, y:number, dis:number, duration:number) {
        let bubbleX = x + Math.random() * (Math.random() - 0.5) * dis;
        let bubbleY = y + Math.random() * (Math.random() - 0.5) * dis;
        bb.push(new Bubble(canvasRef, bubbleX, bubbleY, duration));
    }
    function generateFrontBubble(x:number, y:number, dis:number, duration:number) {
        let bubbleX = x + Math.random() * (Math.random() - 0.5) * dis;
        let bubbleY = y + Math.random() * (Math.random() - 0.5) * dis;
        fb.push(new Bubble(canvasRef, bubbleX, bubbleY, duration));
    }
    function updateBubble() {
        for(let i = 0; i < bb.length; i++) {
            if(bb[i]) {
                bb[i].move();
                if(bb[i].isOut()) {delete bb[i];}
            }
        }
        for(let i = 0; i < fb.length; i++) {
            if(fb[i]) {
                fb[i].move();
                if(fb[i].isOut()) {delete fb[i];}
            }
        }
    }
    function drawBubble() {
        for(let i = 0; i < bb.length; i++) {
            if(bb[i]) {
                bb[i].draw();
            }
        }
    }
    function drawFrontBubble() {
        for(let i = 0; i < fb.length; i++) {
            if(fb[i]) {
                fb[i].draw();
            }
        }
    }

    //Heart//////
    const ht: Array<Heart> = []
    function drawHeart() {
        for(let i = 0; i < ht.length; i++) {
            if(ht[i]) {
                ht[i].draw();
            }
        }
    }

    //Bar//////
    let tb : TorpedoBar | null = null;

    const keyDownHandler = (e: KeyboardEvent) => {
        if (e.code == 'ArrowRight') {
            input.right = true
        }
        if (e.code == 'ArrowLeft') {
            input.left = true
        }
        if (e.code == 'ArrowUp') {
            input.up = true
        }
        if (e.code == 'ArrowDown') {
            input.down = true
        }
        if (e.code == 'Space') {
            input.space = true
        }
    }
    const keyUpHandler = (e: KeyboardEvent) => {
        if (e.code == "ArrowRight") {
            input.right = false
        }
        if (e.code == "ArrowLeft") {
            input.left = false
        }
        if (e.code == 'ArrowUp') {
            input.up = false
        }
        if (e.code == 'ArrowDown') {
            input.down = false
        }
        if (e.code == 'Space') {
            input.space = false
        }
    }



    let shakingEndTime = new Date().getTime();
    function damageScreen(duration: number) {
        shakingEndTime = new Date().getTime() + duration;
        canvasRef.current!.classList.add("red_shake")
    }
    function shakeScreen(duration: number) {
        shakingEndTime = new Date().getTime() + duration;
        canvasRef.current!.classList.add("shake")
    }
    function stopShakeScreen() {
        if(shakingEndTime < new Date().getTime()) {
            canvasRef.current!.classList.remove("shake")
            canvasRef.current!.classList.remove("red_shake")
        }
    }

    function getDamage(damage: number) {
        if(lastHitTime + reinforceTime < new Date().getTime() && !sub!.dead) {
            lastHitTime = new Date().getTime();
            sub!.reinforce = true;

            if(hp > 0) {
                damageScreen(200);
                ht[hp-1].enabled = false;
                hp -= 1;
                if(hp == 0) {
                    damageScreen(700);
                    sub!.reinforce = false;
                    sub!.dead = true;
                }
            }
        }
    }

    function checkReinforce() {
        if(sub!.reinforce) {
            if(lastHitTime + reinforceTime < new Date().getTime())
                sub!.reinforce = false;
        }
    }

    function draw(canvas: HTMLCanvasElement) {
        let canvasCheck = canvasRef.current;
        if(!canvasCheck) return
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //BackEffect
        drawBubble();

        //Element
        drawTorpedo();
        drawGreenfish();
        sub!.draw();
        drawExplode();

        //FrontEffect
        drawFrontBubble();
        drawItem();

        //UI
        drawHeart();
        tb!.draw();
    }

    let updateInterval = 0;
    let drawInterval = 0;

    let startTime = new Date().getTime();
    let lastGenTime = new Date().getTime();

    function generateFish() {
        let deltaTime = new Date().getTime() - lastGenTime;
        let totalTime = new Date().getTime() - startTime;
        lastGenTime = new Date().getTime();

        const greenFre = 1.5 + 0.1 * (totalTime/15000);
        const virdianPro = 0.1 + (score-150000)/20000 * 0.05;
        const forestPro = 0.1 + (score-300000)/20000 * 0.1;
        const mintFre = 0.2 + (score-10000)/10000 * 0.01;

        const yellowFre = 0.1 + (totalTime/10000) * 0.01;
        let purplePro = 0.1 + (score-300000)/10000 * 0.05;
        if(purplePro < 0.1) purplePro = 0.1;

        let jellyFre = 0.1 + (totalTime/10000) * 0.05
        if(jellyFre > 0.6) jellyFre = 0.6;

        if(Math.random() < deltaTime/1000 * greenFre) {
            if(score >= 150000 && Math.random() < virdianPro) {
                if(score >= 300000 && Math.random() < forestPro) {
                    generateForestfish()
                } else {
                    generateVirdianfish()
                }
            }
            else {
                generateGreenfish()
            }
        }

        if(totalTime>=20000 && score>= 10000 && Math.random() < deltaTime/1000 * mintFre) {
            generateMintfish()
        }

        if(totalTime >= 60000 && Math.random() < deltaTime/1000 * yellowFre) {
            if(totalTime >= 180000 && Math.random() < purplePro) {
                generatePurplefish()
            }
            else {
                generateYellowfish()
            }
        }

        if(score >= 100000 && Math.random() < deltaTime/1000 * jellyFre) {
            generateJellyfish()
        }
    }

    function launchTorpedo() {
        if(new Date().getTime() > lastLaunchTime + reloadTime) {
            generateTorpedo();
            lastLaunchTime = new Date().getTime();
        }
    }

    function update() {
        let canvasCheck = canvasRef.current;
        if(!canvasCheck) return

        generateFish();
        //if(Math.random() < 0.03) generateJellyfish();
        //if(Math.random() < 0.02) generateYellowfish();
        //if(Math.random() < 0.01) generatePurplefish();

        let canvas = canvasCheck!;
        let ctx= canvas.getContext("2d")!;
        sub!.processInput(input);
        sub!.move();

        if(input.space) launchTorpedo();

        updateTorpedo();
        updateGreenfish()
        updateExplode();
        updateBubble();
        updateItem();

        stopShakeScreen();
        checkReinforce();

        let percent = (new Date().getTime() - lastLaunchTime) / reloadTime;
        if(percent > 1) percent = 1;
        tb!.percent = percent;

        /*if(sub!.dead) {
            shakeScreen(100);
        }*/

        if(sub!.dead && sub!.isOut()) {
            endGame();
            window.clearInterval(updateInterval);
            window.clearInterval(drawInterval);
        }
    }

    useEffect(()=>{
        height = window.innerHeight;

        const resizeCanvas = () => {
            window.scrollBy(0, -height + window.innerHeight);
            height = window.innerHeight;
            if(!isMobileSafari)
            {
                canvasRef.current!.width = window.innerWidth;
                canvasRef.current!.height = window.innerHeight;
            }
            draw(canvasRef.current!);
        }

        canvasRef.current!.width = window.innerWidth;
        canvasRef.current!.height = window.innerHeight;

        sub = new Submarine(canvasRef, generateBubble, imagePre);
        tb = new TorpedoBar(canvasRef, imagePre);
        tb.percent = 1; //시작시 즉시 장전

        for(let i = 0; i < hp; i++) {
            ht.push(new Heart(canvasRef, i, imagePre));
        }

        durationScrollTo(gameRef.current!.scrollHeight, 2000, 4);

        drawInterval = window.setInterval(()=> {
            draw(canvasRef.current!);
        }, 5)

        window.addEventListener('resize', resizeCanvas, false);
        window.addEventListener("fullscreenchange" , resizeCanvas, false);
        window.addEventListener('touchmove', resizeCanvas, false);
        window.addEventListener('scroll', resizeCanvas, false);
        window.addEventListener("keyup", keyUpHandler, false);
        window.addEventListener("keydown", keyDownHandler, false);

        setTimeout(()=>{
            window.scrollTo({ top: (window.innerHeight)});
            startTime = new Date().getTime();
            updateInterval = window.setInterval(() => {
                update();
            }, 5);
            addScore(0);

        }, 2000);



        return () => {
            window.removeEventListener('resize', resizeCanvas, false);
            window.removeEventListener("fullscreenchange" , resizeCanvas, false);
            window.removeEventListener('touchmove', resizeCanvas, false);
            window.removeEventListener('scroll', resizeCanvas, false);
            window.removeEventListener("keyup", keyUpHandler, false);
            window.removeEventListener("keydown", keyDownHandler, false);
        }
    }, [])

    return <>
        <canvas ref={canvasRef} className="relative z-5" width="100%" height="100%"></canvas>
    </>
}