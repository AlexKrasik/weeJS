import {WeeStage} from "./WeeStage";

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
        canvasEl.width = this._width = width;
        canvasEl.height = this._height = height;

        // add canvas to DOM
        const parentEl = document.querySelector(parentSelector) || document.body;
        parentEl.append(canvasEl);

        this.ctx = canvasEl.getContext('2d');

        // start main loop
        this.loop(0);
    }

    private loop(time) {
        this._elapsed = time - this._lastFrameTime;
        this._lastFrameTime = time;
        //clear canvas
        this.ctx.fillStyle = "#222";
        this.ctx.fillRect(0, 0, this._width, this._height);
        // update current stage
        this.stage?.loop();
        requestAnimationFrame((time) => {
            this.loop(time);
        });
    }

    /**
     * Currently active stage
     */
    set stage(s: WeeStage) {
        this._stage = s;
        this._stage.game = this;
    }

    get stage() {
        return this._stage;
    }

    private readonly _width: number;
    private readonly _height: number;
    private _elapsed: number;
    private _lastFrameTime: number = 0;
    private _stage: WeeStage = null;
    ctx: CanvasRenderingContext2D = null;
}