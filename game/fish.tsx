import Hitbox from "@/public/scripts/hitbox";
import {Submarine} from "@/game/submarine";

export enum Color {
    GREEN,
    JELLY,
    VIRDIAN,
    YELLOW,
    MINT,
    FOREST,
    PURPLE,
}

export const fishScore = {
    [Color.GREEN]: 1000,
    [Color.JELLY]: 3000,
    [Color.VIRDIAN]: 3000,
    [Color.YELLOW]: 3000,
    [Color.MINT]: 5000,
    [Color.FOREST]: 5000,
    [Color.PURPLE]: 10000,
}

export interface Fish extends Hitbox {
    color: Color;
    hp: number;
    move(): void;
    draw(): void;

    checkAttack(submarine: Submarine): Boolean;

    isOut(): Boolean;

}