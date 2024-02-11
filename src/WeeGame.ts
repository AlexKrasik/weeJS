import {WeeStage} from "./WeeStage";
import {WeeInput} from "./Wee";

export class WeeGame {
    /**
     * Set up a new game
     * @param {number} width - Base width of your game.
     * @param {number} height -Base height of your game.
     * @param {string} parentSelector - Where game canvas is will be placed in DOM.
     */
    constructor(width: number = 320, height: number = 480, parentSelector: string) {
        WeeInput.init();

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
        this._delta = (time - this._lastFrameTime) / 1000;
        this._lastFrameTime = time;

        //clear canvas
        this.ctx.fillStyle = "#111";
        this.ctx.fillRect(0, 0, this._width, this._height);

        // update current stage
        this.stage?.loop(this._delta);

        // clear inputs data
        WeeInput._clear();
        requestAnimationFrame((time) => this.loop(time));
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

    get elapsed() {
        return this._delta;
    }

    private readonly _width: number;
    private readonly _height: number;
    private _delta: number;
    private _lastFrameTime: number = 0;
    private _stage: WeeStage = null;
    ctx: CanvasRenderingContext2D = null;
    debug: boolean = false;
}