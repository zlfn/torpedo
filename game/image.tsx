export class ImagePreload {
    forestFish: Array<HTMLImageElement> = []
    forestFishFlip: Array<HTMLImageElement> = []
    greenFish: Array<HTMLImageElement> = []
    greenFishFlip: Array<HTMLImageElement> = []
    jellyFish: Array<HTMLImageElement> = []
    mintFish: Array<HTMLImageElement> = []
    mintFishFlip: Array<HTMLImageElement> = []
    virdianFish: Array<HTMLImageElement> = []
    virdianFishFlip: Array<HTMLImageElement> = []

    yellowFish: Array<HTMLImageElement> = []
    yellowFishOpen: Array<HTMLImageElement> = []
    yellowFishFlip: Array<HTMLImageElement> = []
    yellowFishOpenFlip: Array<HTMLImageElement> = []

    purpleFish: Array<HTMLImageElement> = []
    purpleFishOpen: Array<HTMLImageElement> = []
    purpleFishFlip: Array<HTMLImageElement> = []
    purpleFishOpenFlip: Array<HTMLImageElement> = []

    torpedoUpgrade: HTMLImageElement;
    heartRestore: HTMLImageElement;
    speedUp: HTMLImageElement;
    floatUp: HTMLImageElement

    heart: HTMLImageElement;
    heartEmpty: HTMLImageElement;

    explode: Array<HTMLImageElement> = [];

    torpedo: Array<HTMLImageElement> = [];
    torpedoFlip: Array<HTMLImageElement> = [];
    torpedoBar: Array<HTMLImageElement> = [];

    submarine: Array<HTMLImageElement> = [];
    submarineFlip: Array<HTMLImageElement> = [];

    constructor() {
        for(let i = 1; i < 7; i++) {
            const im = new Image()
            im.src = "resource/forestfish/forestfish" + i + ".png";
            this.forestFish.push(im);
        }
        for(let i = 1; i < 7; i++) {
            const im = new Image()
            im.src = "resource/forestfish/flip_forestfish" + i + ".png";
            this.forestFishFlip.push(im);
        }
        for(let i = 1; i < 7; i++) {
            const im = new Image()
            im.src = "resource/greenfish/greenfish" + i + ".png";
            this.greenFish.push(im);
        }
        for(let i = 1; i < 7; i++) {
            const im = new Image()
            im.src = "resource/greenfish/flip_greenfish" + i + ".png";
            this.greenFishFlip.push(im);
        }
        for(let i = 1; i < 7; i++) {
            const im = new Image()
            im.src = "resource/jellyfish/jellyfish" + i + ".png";
            this.jellyFish.push(im);
        }
        for(let i = 1; i < 7; i++) {
            const im = new Image()
            im.src = "resource/mintfish/mintfish" + i + ".png";
            this.mintFish.push(im);
        }
        for(let i = 1; i < 7; i++) {
            const im = new Image()
            im.src = "resource/mintfish/flip_mintfish" + i + ".png";
            this.mintFishFlip.push(im);
        }
        for(let i = 1; i < 7; i++) {
            const im = new Image()
            im.src = "resource/virdianfish/virdianfish" + i + ".png";
            this.virdianFish.push(im);
        }
        for(let i = 1; i < 7; i++) {
            const im = new Image()
            im.src = "resource/virdianfish/flip_virdianfish" + i + ".png";
            this.virdianFishFlip.push(im);
        }

        for(let i = 1; i < 7; i++) {
            const im = new Image()
            im.src = "resource/yellowfish/yellowfish" + i + ".png";
            this.yellowFish.push(im);
        }
        for(let i = 1; i < 7; i++) {
            const im = new Image()
            im.src = "resource/yellowfish/open_yellowfish" + i + ".png";
            this.yellowFishOpen.push(im);
        }
        for(let i = 1; i < 7; i++) {
            const im = new Image()
            im.src = "resource/yellowfish/flip_yellowfish" + i + ".png";
            this.yellowFishFlip.push(im);
        }
        for(let i = 1; i < 7; i++) {
            const im = new Image()
            im.src = "resource/yellowfish/open_flip_yellowfish" + i + ".png";
            this.yellowFishOpenFlip.push(im);
        }

        for(let i = 1; i < 7; i++) {
            const im = new Image()
            im.src = "resource/purplefish/purplefish" + i + ".png";
            this.purpleFish.push(im);
        }
        for(let i = 1; i < 7; i++) {
            const im = new Image()
            im.src = "resource/purplefish/open_purplefish" + i + ".png";
            this.purpleFishOpen.push(im);
        }
        for(let i = 1; i < 7; i++) {
            const im = new Image()
            im.src = "resource/purplefish/flip_purplefish" + i + ".png";
            this.purpleFishFlip.push(im);
        }
        for(let i = 1; i < 7; i++) {
            const im = new Image()
            im.src = "resource/purplefish/open_flip_purplefish" + i + ".png";
            this.purpleFishOpenFlip.push(im);
        }

        let im = new Image()
        im.src = "resource/item/torpedoupgrade.png";
        this.torpedoUpgrade = im;
        im = new Image()
        im.src = "resource/item/heartrestore.png";
        this.heartRestore = im;
        im = new Image()
        im.src = "resource/item/speedup.png";
        this.speedUp = im;
        im = new Image()
        im.src = "resource/item/floatup.png";
        this.floatUp = im;

        im = new Image()
        im.src = "resource/heart/heart.png";
        this.heart = im;
        im = new Image()
        im.src = "resource/heart/empty_heart.png";
        this.heartEmpty = im;

        for(let i = 1; i < 19; i++) {
            const im = new Image()
            im.src = "resource/torpedobar/torpedobar" + i + ".png";
            this.torpedoBar.push(im);
        }

        for(let i = 1; i < 9; i++) {
            const im = new Image()
            im.src = "resource/explode/explode" + i + ".png";
            this.explode.push(im);
        }

        for(let i = 1; i < 3; i++) {
            const im = new Image()
            im.src = "resource/torpedo/torpedo" + i + ".png";
            this.torpedo.push(im);
        }
        for(let i = 1; i < 3; i++) {
            const im = new Image()
            im.src = "resource/torpedo/flip_torpedo" + i + ".png";
            this.torpedoFlip.push(im);
        }

        for(let i = 1; i < 3; i++) {
            const im = new Image()
            im.src = "resource/submarine/submarine" + i + ".png";
            this.submarine.push(im);
        }
        for(let i = 1; i < 3; i++) {
            const im = new Image()
            im.src = "resource/submarine/flip_submarine" + i + ".png";
            this.submarineFlip.push(im);
        }
    }
}
