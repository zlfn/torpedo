import {RefObject, useRef} from "react";
import {Submarine} from '../submarine'
import {getDistance, isCollide} from "@/public/scripts/hitbox";
import {Color, Fish} from "@/game/fish";
import {ImagePreload} from "@/game/image";

export class PurpleFish implements Fish {

    x = 0;
    y = 0;
    dx = 0;
    dy = 0;
    width = 65 * (21/19);
    height = 65;
    color = Color.PURPLE;
    hp = 1;


    speed = 0.3; //속도
    TargetSpeed = 0.4; //달리는 속도

    flip = true;

    currentFrame = 1;
    maxFrame = 6;
    frameDuration = 300;

    lastChange = new Date().getTime();

    Targeting = false;
    rotate = 0;

    canvasRef :RefObject<HTMLCanvasElement>;
    lastTime = new Date().getTime();

    pre: ImagePreload;

    constructor(canRef:RefObject<HTMLCanvasElement>, pre: ImagePreload) {
        this.canvasRef = canRef
        this.y = Math.random() * canRef.current!.height;
        this.flip = (Math.random() > 0.5);
        if(this.flip) {
            this.x = -this.width;
            this.dx = this.speed;
        }
        else {
            this.x = this.canvasRef.current!.width + this.width;
            this.dx = -this.speed;
        }
        this.pre = pre;
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
        if(!this.flip) {
            return (this.x < -this.width) || (this.y < -this.height) || (this.y > this.canvasRef.current!.height)
        }
        else {
            return (this.x > this.canvasRef.current!.width + this.width) || (this.y < -this.height) || (this.y > this.canvasRef.current!.height)
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
        if(!this.Targeting && getDistance(this, sub) < this.canvasRef.current!.height * (1/2)) {
            this.Targeting = true;
            this.speed = this.TargetSpeed;
            let vector: {x: number, y:number} = {x: sub.x - this.x, y:sub.y - this.y};
            const mag = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
            vector.x = vector.x / mag * this.speed; vector.y = vector.y / mag * this.speed;
            this.dx = vector.x; this.dy = vector.y;
            this.rotate = Math.atan2(vector.y, vector.x);
            if(!this.flip) this.rotate = this.rotate + Math.PI;
        }
        return isCollide(this, sub.coll)
    }

    draw() {
        const canvas = this.canvasRef.current!;
        const ctx= canvas.getContext("2d")!;
        let image = new Image();
        this.playFrame();

        //let srcString = "";
        //if(this.Targeting) srcString += "open_";
        //if(this.flip) srcString += "flip_";
        //image.src = "resource/purplefish/" + srcString + "purplefish" + this.currentFrame + ".png";

        if(this.flip && this.Targeting) image = this.pre.purpleFishOpenFlip[this.currentFrame-1];
        else if(this.flip) image = this.pre.purpleFishFlip[this.currentFrame-1];
        else if(this.Targeting) image = this.pre.purpleFishOpen[this.currentFrame-1];
        else image = this.pre.purpleFish[this.currentFrame-1];

        ctx.imageSmoothingEnabled = false;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotate);
        ctx.drawImage(image, 0, 0, this.width, this.height);
        ctx.rotate(-this.rotate);
        ctx.translate(-this.x, -this.y);
    }
}
