import {RefObject, useRef} from "react";
import {Submarine} from '../submarine'
import {isCollide} from "@/public/scripts/hitbox";
import {Color, Fish} from "@/game/fish";
import {ImagePreload} from "@/game/image";
import {Ability, Item} from "@/game/item";

export class HeartRestore implements Item{
    x = 0;
    y = 0;
    dy = 0;
    width = 50;
    height = 50 * (17/16);
    ability = Ability.HeartRestore;

    speed = 0.05; //속도

    canvasRef :RefObject<HTMLCanvasElement>;

    lastTime = new Date().getTime();
    pre: ImagePreload;

    constructor(canRef:RefObject<HTMLCanvasElement>, f: Fish, pre:ImagePreload) {
        this.canvasRef = canRef
        this.pre = pre;
        this.x = f.x;
        this.y = f.y;
        this.dy = -this.speed;
    }

    move() {
        const canvas = this.canvasRef.current!;
        const currentTime = new Date().getTime();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.y += this.dy * deltaTime;
    }

    isOut(): boolean {
        return this.y < - this.height;
    }

    checkAttain(sub: Submarine) {
        return isCollide(this, sub)
    }

    draw() {
        const canvas = this.canvasRef.current!;
        const ctx= canvas.getContext("2d")!;
        let image = new Image();

        image = this.pre.heartRestore;

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, this.x, this.y, this.width, this.height);
    }
}
