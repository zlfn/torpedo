import {RefObject, useRef} from "react";
import {Input} from '../app/game';
import {Bubble} from "@/game/bubble";
import Hitbox from "@/public/scripts/hitbox";
import {ImagePreload} from "@/game/image";

export class Submarine implements Hitbox {
    x = 0;
    y = 0;
    dx = 0;
    dy = 0;
    //실제 너비, 높이
    width = 100;
    height = 75;
    //충돌판정 오브젝트 너비, 높이
    coll: Hitbox = {
        x : 0,
        y : 0,
        width : 30,
        height : 20,
    }

    max_speed = 0.25; //최대 속도
    acceleration = 0.002; //가속도
    resistance = 0.003; //속도 저항

    max_float = 0.2; //최대 승강 속도
    buoyancy = 0.001; //승강 가속도

    reinforce = false;

    flip = false;

    canvasRef :RefObject<HTMLCanvasElement>;

    currentFrame = 1;
    frameDuration = 20;
    lastChange = new Date().getTime();
    framePlay = false;

    dead = false;

    lastTime = new Date().getTime();

    pre: ImagePreload


    generateBubble: Function;

    constructor(canRef:RefObject<HTMLCanvasElement>, generateBubble: Function, pre:ImagePreload) {
        this.canvasRef = canRef;
        const canvas = this.canvasRef.current!;
        this.x = canvas.width/2 - this.width/2;
        this.y = canvas.height/2 - this.height/2;
        this.pre = pre;
        this.generateBubble = generateBubble;
    }

    move() {
        const canvas = this.canvasRef.current!;
        const currentTime = new Date().getTime();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        if(this.dead) {
            this.x += this.dx * deltaTime;
            this.y += 0.3 * deltaTime;
            return;
        }

        this.x += this.dx * deltaTime;
        this.y += this.dy * deltaTime;

        this.coll.x = this.x + (this.width - this.coll.width) / 2;
        this.coll.y = this.y + (this.height - this.coll.height) / 2;

        if(this.x < 0) this.dx += 0.005 * deltaTime;
        if(this.x > canvas.width - this.width) this.dx -= 0.005 * deltaTime;
        if(this.y < 0) if(this.dy < 0) this.dy += 0.003 * deltaTime;
        if(this.y > canvas.height - this.height) if(this.dy > 0) this.dy -= 0.003 * deltaTime;

        if(Math.random() < Math.abs(this.dx) * (1.5) && this.framePlay) {
            //let bubbleX = this.x + Math.random() * (Math.random() - 0.5) * 40;
            //let bubbleY = this.y + Math.random() * (Math.random() - 0.5) * 40;
            if(!this.flip)
                this.generateBubble(this.x, this.y + this.height*(1/2), 40, 5000);
            else
                this.generateBubble(this.x + this.width, this.y + this.height*(1/2), 40, 5000);
        }
    }

    isOut() {
        return this.y > this.canvasRef.current!.height;
    }

    playFrame() {
        this.frameDuration = (0.4 - Math.abs(this.dx)) * 400;
        if(this.framePlay) {
            const currentTime = new Date().getTime();
            if(currentTime - this.lastChange > this.frameDuration) {
                if(this.currentFrame==1) this.currentFrame = 2;
                else if(this.currentFrame==2) this.currentFrame = 1;
                this.lastChange = currentTime;
            }
        }
    }

    processInput(inp: Input) {
        if(inp.right || inp.left) {
            this.framePlay = true;
        } else {
            this.framePlay = false;
        }

        if(inp.right) {
            if (this.dx <= this.max_speed) {this.dx += this.acceleration;}
            this.flip = false;
        } else {
            if(this.dx > 0) this.dx -= this.resistance;
        }
        if(inp.left) {
            if (this.dx >= -this.max_speed) {this.dx -= this.acceleration;}
            this.flip = true;
        } else {
            if(this.dx < 0) this.dx += this.resistance;
        }

        if(inp.up) {
            if(this.dy >= -this.max_float) {this.dy -= this.buoyancy;}
        }
        if(inp.down) {
            if(this.dy <= this.max_float) {this.dy += this.buoyancy;}
        }
    }


    draw() {
        const canvas = this.canvasRef.current!;
        const ctx= canvas.getContext("2d")!;
        let image = new Image();
        this.playFrame();
        if(this.reinforce) ctx.globalAlpha=0.6;

        if(!this.flip) {
            image = this.pre.submarine[this.currentFrame-1];
            //image.src = "resource/submarine/submarine" + this.currentFrame + ".png";
        } else {
            image = this.pre.submarineFlip[this.currentFrame-1];
            //image.src = "resource/submarine/flip_submarine" + this.currentFrame + ".png";
        }

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, this.x, this.y, this.width, this.height);
        ctx.globalAlpha=1.0;
    }
}

