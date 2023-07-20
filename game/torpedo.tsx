import {RefObject, useRef} from "react";
import {Submarine} from './submarine'
import {Bubble} from "./bubble";
import Hitbox, {isCollide} from "@/public/scripts/hitbox";
import {ImagePreload} from "@/game/image";

export class Torpedo implements Hitbox {
    x = 0;
    y = 0;
    dx = 0;
    dy = 0;
    width = 90;
    height = 30;

    speed = 2; //속도
    acceleration = 0.0004; //가속도
    resistanceY = 0.00004; //Y 방향 감속도

    flip = true;

    currentFrame = 1;
    maxFrame = 2;
    frameDuration = 20;
    lastChange = new Date().getTime();

    generateBubble: Function = ()=>{};


    canvasRef :RefObject<HTMLCanvasElement>;
    pre: ImagePreload;

    lastTime = new Date().getTime();


    constructor(sub: Submarine, genBubble: Function, pre: ImagePreload) {
        this.canvasRef = sub.canvasRef;
        this.y = sub.y + sub.height - 23;
        this.x = sub.x;
        this.dx = sub.dx;
        this.dy = sub.dy + 0.05;
        this.generateBubble = genBubble
        this.flip = sub.flip;
        this.pre = pre;
        if(this.flip) {
            this.acceleration = -this.acceleration
        }
    }

    move() {
        const canvas = this.canvasRef.current!;
        const currentTime = new Date().getTime();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.x += this.dx * deltaTime;
        this.y += this.dy * deltaTime;
        if(Math.abs(this.dx) < this.speed) {
            if((!this.flip && this.dx < 0) || (this.flip && this.dx > 0))
                this.dx += this.acceleration * deltaTime;
            this.dx += this.acceleration * deltaTime;
        }
        if(this.dy > 0) {
            this.dy -= this.resistanceY * deltaTime;
        }
        else if(this.dy < 0) {
            this.dy += this.resistanceY * deltaTime;
        }

        if(Math.random() < Math.abs(this.dx)) {
            let bubbleX = this.x + Math.random() * (Math.random() - 0.5) * 30;
            let bubbleY = this.y + Math.random() * (Math.random() - 0.5) * 30;
            if(!this.flip)
                this.generateBubble(this.x, this.y + this.height * (1/2), 30, 2000);
            else
                this.generateBubble(this.x + this.width, this.y + this.height * (1/2), 30, 2000);
        }
    }

    isOut(): boolean {
        if(this.flip) {
            return (this.x < -this.width)
        }
        else {
            return (this.x > this.canvasRef.current!.width + this.width)
        }
    }

    playFrame() {
        this.frameDuration = 30;
        const currentTime = new Date().getTime();
        if(currentTime - this.lastChange > this.frameDuration) {
            if(this.currentFrame < this.maxFrame)
                this.currentFrame += 1;
            else this.currentFrame = 1;
            this.lastChange = currentTime;
        }
    }

    checkAttack(fish: Hitbox) {
            return Math.abs(this.dx) > 0.05 && isCollide(this, fish)
    }

    draw() {
        const canvas = this.canvasRef.current!;
        const ctx= canvas.getContext("2d")!;
        let image = new Image();
        this.playFrame();

        if(!this.flip) {
            image = this.pre.torpedo[this.currentFrame - 1];
        } else {
            image = this.pre.torpedoFlip[this.currentFrame - 1];
        }

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, this.x, this.y, this.width, this.height);
    }
}
