import {WeeStage} from "./WeeStage";
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

    stage: WeeStage;
    private _sprite: WeeSprite;

    set sprite(s: WeeSprite) {
        this._sprite = s;
        this._sprite.entity = this;
    }

    get sprite() {
        return this._sprite;
    }
}