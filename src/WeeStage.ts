import {WeeEntity} from "./WeeEntity";

export class WeeStage {
    constructor() {
    }

    get loop() {
        return this.#loop;
    }

    #loop() {
        this.update();
        this._entityList.forEach(e => {
            e.loop();
        })
    }

    update() {
    }

    add(e: WeeEntity) {
        this._entityList.push(e);
        return e;
    }

    remove(e) {
        this._entityList = this._entityList.filter(c => c != e);
    }

    private _entityList: WeeEntity[] = [];

}