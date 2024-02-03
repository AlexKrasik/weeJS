import {WeeStage} from "./WeeStage";
import {WeeSprite} from "./WeeSprite";

export class WeeEntity {

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    get loop() {
        return this._loop;
    }

    private _loop() {
        this.sprite?.render();
        this.update();
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

    /**
     * X position
     */
    x: number = 0;
    /**
     * Y position
     */
    y: number = 0;
    /**
     * hitbox X position
     */
    originX: number = 0;
    /**
     * hitbox Y position
     */
    originY: number = 0;
    /**
     * Entity hitbox width
     */
    width: number = 0;
    /**
     * Entity hitbox height
     */
    height: number = 0;
}