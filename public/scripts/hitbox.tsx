export default interface Hitbox {
    x: number
    y: number
    width: number
    height: number
}

export function isCollide(o1: Hitbox, o2: Hitbox) {
    return o2.x - o1.width <= o1.x && o1.x <= o2.x + o2.width && o2.y - o1.height <= o1.y && o1.y <= o2.y + o2.height;
}

export function getDistance(o1:Hitbox, o2: Hitbox) {
    let center1: {x:number, y:number} = {x: o1.x + o1.width * (1/2), y:o1.y + o1.width * (1/2)};
    let center2: {x:number, y:number} = {x: o2.x + o2.width * (1/2), y:o2.y + o2.width * (1/2)};
    return Math.sqrt(Math.pow(center1.x - center2.x, 2) + Math.pow(center1.y - center2.y, 2));
}
