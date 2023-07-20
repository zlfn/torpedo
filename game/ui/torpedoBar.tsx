import {RefObject} from "react";
import {ImagePreload} from "@/game/image";

export class TorpedoBar {
    width = 80;
    height = 80 * (5/17);
    x = 0;
    y = 0;
    margin = 90;

    canvasRef :RefObject<HTMLCanvasElement>;

    percent = 0
    pre: ImagePreload

    constructor(canRef: RefObject<HTMLCanvasElement>, pre:ImagePreload) {
        this.canvasRef = canRef;
        const canvas = canRef.current!
        this.x = canvas.width * (1/2) - this.width * (1/2);
        this.y = this.margin;
        this.pre = pre;
    }

    draw() {
        const canvas = this.canvasRef.current!;
        const ctx= canvas.getContext("2d")!;

        this.x = canvas.width * (1/2) - this.width * (1/2);
        this.y = this.margin;

        let index = 1;
        for(index = 1; index < 19; index ++) {
            if (index/18 >= this.percent) break;
        }

        const image = this.pre.torpedoBar[index-1]

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, this.x, this.y, this.width, this.height);
    }
}
