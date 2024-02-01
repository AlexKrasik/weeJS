import {WeeSprite} from "./WeeSprite";

export class WeeEntity {

    constructor(x: number = 0, y: number = 0) {

    }

    get loop() {
        return this._loop;
    }

    private _loop() {
        this.update();
        this.sprite?.render();
    }

    update() {

    }

    sprite: WeeSprite
}