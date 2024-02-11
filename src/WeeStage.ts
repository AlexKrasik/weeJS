import {WeeEntity} from "./WeeEntity";
import {WeeGame} from "./WeeGame";

export class WeeStage {
    constructor() {
    }

    get loop() {
        return this._loop;
    }

    private _loop(_delta) {
        this.update(_delta);
        if (this._needReorder) {
            this._entityList = this._entityList.sort((a, b) => (a.z > b.z) ? 1 : -1);
        }
        this._entityList.forEach(e => {
            e.loop(_delta);
        });
        if (this.game.debug) {
            const ctx = this.game.ctx;
            this._entityList.forEach(e => {
                //entity hitbox
                ctx.strokeStyle = e.hitboxColor;
                ctx.lineWidth = 1;
                ctx.strokeRect(Math.floor(e.x) + .5 + e.originX, Math.floor(e.y) + .5 + e.originY, e.width, e.height);
                // entity position
                ctx.strokeStyle = "#00DDFF";
                ctx.strokeRect(Math.floor(e.x) - .5, Math.floor(e.y) - .5, 2, 2);
            });
        }
    }

    update(_delta) {
    }

    add(e: WeeEntity) {
        this._entityList.push(e);
        e.stage = this;
        return e;
    }

    remove(e) {
        this._entityList = this._entityList.filter(c => c != e);
    }

    private _entityList: WeeEntity[] = [];

    get entityList() {
        return this._entityList;
    }

    game: WeeGame = null;

    private _needReorder: boolean = false;

    reorderZ() {
        this._needReorder = true;
    }

}