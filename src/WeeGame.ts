export class WeeGame {
    /**
     * Set up a new game
     * @param {number} width - Base width of your game.
     * @param {number} height -Base height of your game.
     * @param {string} parentSelector - Where game canvas is will be placed in DOM.
     */
    constructor(width: number = 320, height: number = 480, parentSelector: string) {

        // create canvas element
        const canvasEl: HTMLCanvasElement = document.createElement("canvas");
        canvasEl.width = width;
        canvasEl.height = height;

        // add canvas to DOM
        const parentEl = document.querySelector(parentSelector) || document.body;
        parentEl.append(canvasEl);

        // start main loop
        this.update();
    }

    update() {
        requestAnimationFrame(() => {
            this.update();
        });
    }
}