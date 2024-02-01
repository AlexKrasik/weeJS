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

        this._ctx = canvasEl.getContext('2d');

        // start main loop
        this.loop(0);
    }

    private loop(time) {
        this._elapsed = time - this._lastFrameTime;
        this._lastFrameTime = time;
        //clear canvas
        this._ctx.fillStyle = "#222";
        this._ctx.fillRect(0, 0, this._width, this._height);
        // update current stage
        this._stage?.loop();
        requestAnimationFrame((time) => {
            this.loop(time);
        });

        console.log(this._elapsed)
    }

    /**
     * Currently active stage
     */

    setStage(s: WeeStage) {
        this._stage = s;
    }

    private readonly _width: number;
    private readonly _height: number;
    private _elapsed: number;
    private _stage: WeeStage = null;
    private _ctx: CanvasRenderingContext2D = null;
    private _lastFrameTime: number = 0;
}