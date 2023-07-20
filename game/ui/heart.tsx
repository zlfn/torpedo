import {RefObject} from "react";
import {ImagePreload} from "@/game/image";

export class Heart {
    width = 50;
    height = 50 * (40/45);
    x = 0;
    y = 0;
    marginT = 20;
    margin = 13;

    index = 0;

    canvasRef :RefObject<HTMLCanvasElement>;

    enabled = true;
    pre:ImagePreload

    constructor(canRef: RefObject<HTMLCanvasElement>, i: number, pre:ImagePreload) {
        this.canvasRef = canRef;
        const canvas = canRef.current!
        this.x = canvas.width;
        this.x -= (this.width + this.marginT);
        this.x -= (this.width + this.margin) * (i);
        this.y = this.marginT;
        this.index = i;
        this.pre = pre;
    }

    draw() {
        const canvas = this.canvasRef.current!;
        const ctx= canvas.getContext("2d")!;
        let image = new Image();

        this.x = canvas.width;
        this.x -= (this.width + this.marginT);
        this.x -= (this.width + this.margin) * (this.index);
        this.y = this.marginT;


        if(this.enabled) {
            image = this.pre.heart;
            //image.src = "resource/heart/heart.png";
        } else {
            image = this.pre.heartEmpty;
            //image.src = "resource/heart/empty_heart.png";
        }

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, this.x, this.y, this.width, this.height);
    }
}