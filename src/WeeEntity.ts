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

    private _sprite: WeeSprite;

    set sprite(s: WeeSprite) {
        this._sprite = s;
        this._sprite.entity = this;
    }

    get sprite() {
        return this._sprite;
    }

    /**
     * Check for collision with entity from group
     * @param {string} group collision group
     * @param {number} offsetX X offset of entity hitbox. Use to predict collision
     * @param {number} offsetY Y offset of entity hitbox. Use to predict collision
     */
    collide(group: string, offsetX = 0, offsetY = 0) {
        const result = [];
        this.stage.entityList.forEach(e => {
            if (e != this && e.group == group) {
                if (this.collideWith(e, offsetX, offsetY))
                    result.push(e);
            }
        });
        return result;
    }

    /**
     * Check for collision with specific entity
     * @param {WeeEntity} e entity to check collision with
     * @param {number} offsetX X offset of entity hitbox. Use to predict collision
     * @param {number} offsetY Y offset of entity hitbox. Use to predict collision
     */
    collideWith(e: WeeEntity, offsetX = 0, offsetY = 0) {
        const l1 = this.x + this.originX + offsetX;
        const r1 = this.x + this.originX + offsetX + this.width;
        const t1 = this.y + this.originY + offsetY;
        const b1 = this.y + this.originY + offsetY + this.height;

        const l2 = e.x + e.originX;
        const r2 = e.x + e.originX + e.width;
        const t2 = e.y + e.originY;
        const b2 = e.y + e.originY + e.height;

        return (l1 <= r2 && l2 <= r1 && t1 <= b2 && t2 <= b1);
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
    /**
     * Entity hitbox collision group
     */
    group: string = '';
    /**
     *  Stage this entity belongs to
     */
    stage: WeeStage;

}