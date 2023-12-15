import {WeeSprite} from "./WeeSprite";

export class WeeEntity {
    sprite: WeeSprite

    constructor(x: number = 0, y: number = 0) {

    }

    get loop() {
        return this.#loop;
    }

    #loop() {
        this.update();
        this.sprite?.render();
    }

    update() {}
}