import {RefObject, useRef} from "react";
import {Submarine} from './submarine'
import {Bubble} from "./bubble";
import {Torpedo} from "@/game/torpedo";
import Hitbox, {isCollide} from "@/public/scripts/hitbox";
import {ImagePreload} from "@/game/image";


export class Explode {
    x = 0;
    y = 0;
    width = 40;
    height = 40;

    currentFrame = 1;
    maxFrame = 8;
    frameDuration = 30;
    lastChange = new Date().getTime();

    maxWidth = this.width * this.maxFrame;
    maxHeight = this.height * this.maxFrame;

    pre:ImagePreload


    canvasRef :RefObject<HTMLCanvasElement>;

    coll: Hitbox = {
        x : this.x - this.width * (1/2),
        y : this.y - this.height * (1/2),
        width : this.width,
        height : this.height,
    }

    hit: Array<number> = [];
    startTime: number;

    generateBubble: Function = ()=>{};

    constructor(tp: Torpedo, genBubble: Function, pre: ImagePreload) {
        this.canvasRef = tp.canvasRef;
        this.startTime = new Date().getTime();
        this.generateBubble = genBubble;

        if(tp.flip) this.x = tp.x;
        else this.x = tp.x + tp.width;
        this.y = tp.y + tp.height * (1/2);

        this.pre = pre;

        this.coll = {
            x : this.x - this.width * (1/2),
            y : this.y - this.height * (1/2),
            width : this.width,
            height : this.height,
        }
    }

    isOut(): boolean {
        if(new Date().getTime() > this.startTime + this.frameDuration * this.maxFrame + 50)
            return true;
        else return false;
    }

    playFrame() {
        const currentTime = new Date().getTime();
        if(currentTime - this.lastChange > this.frameDuration) {
            if(this.currentFrame < this.maxFrame)
                this.currentFrame += 1;

            this.width = (this.maxWidth / this.maxFrame) * this.currentFrame;
            this.height = (this.maxHeight / this.maxFrame) * this.currentFrame;
            this.lastChange = currentTime;

            this.coll.x = this.x - this.width * (1/2);
            this.coll.y = this.y - this.height * (1/2);
            this.coll.width = this.width;
            this.coll.height = this.height;
        }
    }


    checkAttack(fish: Hitbox) {
        return isCollide(this.coll, fish);
    }

    draw() {
        const canvas = this.canvasRef.current!;
        const ctx= canvas.getContext("2d")!;
        this.playFrame();

        const image = this.pre.explode[this.currentFrame-1];

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, this.x-this.width*(1/2), this.y-this.height*(1/2), this.width, this.height);
    }

    addBubble(fish: Hitbox) {
        const fx = fish.x
        const fy = fish.y
        for(let i = 0; i < 20; i++) {
            this.generateBubble(fx + fish.width * (1/2), fy + fish.height * (1/2), 100, 5000);
        }
    }
}
