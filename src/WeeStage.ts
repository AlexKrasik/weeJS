import {WeeEntity} from "./WeeEntity";

export class WeeStage {
    constructor() {
    }

    get loop() {
        return this.#loop;
    }

    #loop() {
        this.update();
        this.#entityList.forEach(e => {
            e.loop();
        })
    }

    update() {
    }

    #entityList: WeeEntity[] = [];
}