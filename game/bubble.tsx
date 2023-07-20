import {RefObject, useRef} from "react";

export class Bubble {

    x = 0;
    y = 0;
    dx = 0;
    dy = 0;
    width = 10;
    height = 10;
    duration = 2000;


    speed = 2; //속도
    buoyancy = 0.0002; //Y방향 가속도
    resistance = 0.0004; //X방향 감속도
    opacity = 1;


    canvasRef :RefObject<HTMLCanvasElement>;

    startTime: number;
    lastTime = new Date().getTime();

    constructor(canRef:RefObject<HTMLCanvasElement>, x:number, y:number, duration = 2000) {
        this.width *= (Math.random() + 0.5);
        this.height = this.width;
        this.canvasRef = canRef
        this.x = x;
        this.y = y;
        this.startTime  = new Date().getTime();
        this.duration = duration;
    }

    move() {
        const canvas = this.canvasRef.current!;
        const currentTime = new Date().getTime();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.x += this.dx * deltaTime;
        this.y += this.dy * deltaTime;

        if(this.dy > -this.speed) {
            this.dy -= this.buoyancy;
        }

        this.opacity = 1 - ((currentTime - this.startTime) / this.duration);
        if(this.opacity < 0) this.opacity = 0;
    }

    isOut(): boolean {
        return new Date().getTime() > this.startTime + this.duration;
    }

    draw() {
        const canvas = this.canvasRef.current!;
        const ctx= canvas.getContext("2d")!;

        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = "#36619b";
        ctx.fillRect(this.x, this.y, this.width * (2-this.opacity), this.height * (2-this.opacity));
        ctx.globalAlpha = 1.0;
    }
}
