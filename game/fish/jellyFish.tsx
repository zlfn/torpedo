import {RefObject, useRef} from "react";
import {Submarine} from '../submarine'
import {isCollide} from "@/public/scripts/hitbox";
import {Color, Fish} from "@/game/fish";
import {ImagePreload} from "@/game/image";

export class JellyFish implements Fish {

    x = 0;
    y = 0;
    dx = 0;
    dy = 0;
    width = 10/3*10;
    height = 19/3*10;

    color = Color.JELLY;

    hp = 1;

    speed = 0.2; //속도

    flip = true;

    currentFrame = 1;
    maxFrame = 6;
    frameDuration = 20;
    lastChange = new Date().getTime();

    canvasRef :RefObject<HTMLCanvasElement>;

    lastTime = new Date().getTime();
    pre: ImagePreload

    constructor(canRef:RefObject<HTMLCanvasElement>, pre:ImagePreload) {
        this.canvasRef = canRef
        this.x = Math.random() * canRef.current!.width;
        //this.flip = (Math.random() > 0.5);
        this.speed = 0.1 + Math.random() * 0.2;
        this.frameDuration = (0.5 - this.speed) * 300;
        this.y = -this.height;
        this.dy = this.speed;
        this.pre = pre;
        /*if(this.flip) {
            this.x = -this.width;
            this.dx = this.speed;
        }
        else {
            this.x = this.canvasRef.current!.width + this.width;
            this.dx = -this.speed;
        }*/
    }

    move() {
        const canvas = this.canvasRef.current!;
        const currentTime = new Date().getTime();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.x += this.dx * deltaTime;
        this.y += this.dy * deltaTime;
    }

    isOut(): boolean {
        /*if(!this.flip) {
            return (this.x < -this.width)
        }
        else {
            return (this.x > this.canvasRef.current!.width + this.width)
        }*/
        return (this.y >= this.canvasRef.current!.height);
    }

    playFrame() {
        const currentTime = new Date().getTime();
        if(currentTime - this.lastChange > this.frameDuration) {
            if(this.currentFrame < this.maxFrame)
                this.currentFrame += 1;
            else this.currentFrame = 1;
            this.lastChange = currentTime;
        }
    }

    checkAttack(sub: Submarine) {
        return isCollide(this, sub.coll)
    }

    draw() {
        const canvas = this.canvasRef.current!;
        const ctx= canvas.getContext("2d")!;
        let image = new Image();
        this.playFrame();

        image = this.pre.jellyFish[this.currentFrame-1];
        //image.src = "resource/jellyfish/jellyfish" + this.currentFrame + ".png";

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, this.x, this.y, this.width, this.height);
    }
}
