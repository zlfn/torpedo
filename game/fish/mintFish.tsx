import {RefObject, useRef} from "react";
import {Submarine} from '../submarine'
import {isCollide} from "@/public/scripts/hitbox";
import {Color, Fish} from "@/game/fish";
import {ImagePreload} from "@/game/image";

export class MintFish implements Fish{

    x = 0;
    y = 0;
    dx = 0;
    width = 100;
    height = 140/3;
    color = Color.MINT;
    hp = 1;

    speed: number; //속도

    flip = true;

    currentFrame = 1;
    maxFrame = 6;
    frameDuration = 20;
    lastChange = new Date().getTime();

    canvasRef :RefObject<HTMLCanvasElement>;

    lastTime = new Date().getTime();
    pre: ImagePreload;

    constructor(canRef:RefObject<HTMLCanvasElement>, pre: ImagePreload) {
        this.canvasRef = canRef
        this.y = Math.random() * canRef.current!.height;
        this.flip = (Math.random() > 0.5);

        this.speed = 0.4 + Math.random() * 0.1;
        this.pre = pre;

        this.frameDuration = (1.0 - this.speed) * 200;
        if(this.flip) {
            this.x = -this.width;
            this.dx = this.speed;
        }
        else {
            this.x = this.canvasRef.current!.width + this.width;
            this.dx = -this.speed;
        }
    }

    move() {
        const canvas = this.canvasRef.current!;
        const currentTime = new Date().getTime();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.x += this.dx * deltaTime;
    }

    isOut(): boolean {
        if(!this.flip) {
            return (this.x < -this.width)
        }
        else {
            return (this.x > this.canvasRef.current!.width + this.width)
        }
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

        if(!this.flip) {
            image = this.pre.mintFish[this.currentFrame-1]
            //image.src = "resource/mintfish/mintfish" + this.currentFrame + ".png";
        } else {
            image = this.pre.mintFishFlip[this.currentFrame-1]
            //image.src = "resource/mintfish/flip_mintfish" + this.currentFrame + ".png";
        }

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, this.x, this.y, this.width, this.height);
    }
}
