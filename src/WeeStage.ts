import {WeeEntity} from "./WeeEntity";
import {WeeGame} from "./WeeGame";

export class WeeStage {
    constructor() {
    }

    get loop() {
        return this._loop;
    }

    private _loop() {
        this.update();
        this._entityList.forEach(e => {
            e.loop();
        })
    }

    update() {
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
    game: WeeGame = null;

}