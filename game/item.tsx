import Hitbox from "@/public/scripts/hitbox";
import {Submarine} from "@/game/submarine";

export enum Ability {
    TorpedoUp,
    HeartRestore,
    SpeedUp,
    FloatUp,
}

export interface Item extends Hitbox {
    ability: Ability
    move(): void;
    draw(): void;

    checkAttain(submarine: Submarine): Boolean;

    isOut(): Boolean;
}
