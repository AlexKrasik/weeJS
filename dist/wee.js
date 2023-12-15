class WeeGame {
    /**
     * Set up a new game
     * @param {number} width - Base width of your game.
     * @param {number} height -Base height of your game.
     * @param {string} parentSelector - Where game canvas is will be placed in DOM.
     */
    constructor(width = 320, height = 480, parentSelector) {
        // create canvas element
        const canvasEl = document.createElement("canvas");
        canvasEl.width = width;
        canvasEl.height = height;
        // add canvas to DOM
        const parentEl = document.querySelector(parentSelector) || document.body;
        parentEl.append(canvasEl);
        // start main loop
        this.#loop();
    }
    #loop() {
        this.#stage?.loop();
        requestAnimationFrame(() => {
            this.#loop();
        });
    }
    /**
     * Currently active stage
     */
    get stage() {
        return this.#stage;
    }
    ;
    set stage(s) {
        this.#stage = s;
    }
    #stage;
}

class WeeStage {
    constructor() {
    }
    get loop() {
        return this.#loop;
    }
    #loop() {
        this.update();
        this.#entityList.forEach(e => {
            e.loop();
        });
    }
    //
    update() { }
    #entityList = [];
}

export { WeeGame, WeeStage };
