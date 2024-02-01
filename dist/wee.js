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
        canvasEl.width = this._width = width;
        canvasEl.height = this._height = height;
        // add canvas to DOM
        const parentEl = document.querySelector(parentSelector) || document.body;
        parentEl.append(canvasEl);
        this._ctx = canvasEl.getContext('2d');
        // start main loop
        this.loop(0);
    }

    loop(time) {
        this._elapsed = time - this._lastFrameTime;
        console.log(`next: ${time}`);
        console.log(`last: ${this._lastFrameTime}`);
        console.log(`elapsed: ${this._elapsed}`);
        console.log(`fps: ${1000 / this._elapsed}`);
        this._lastFrameTime = time;
        //clear canvas
        this._ctx.fillStyle = "#222";
        this._ctx.fillRect(0, 0, this._width, this._height);
        // update current stage
        this._stage?.loop();
        requestAnimationFrame((time) => {
            this.loop(time);
        });
        console.log(this._elapsed);
    }

    /**
     * Currently active stage
     */
    setStage(s) {
        this._stage = s;
    }

    _width;
    _height;
    _elapsed;
    _stage = null;
    _ctx = null;
    _lastFrameTime = 0;
}

class WeeStage {
    constructor() {
    }

    get loop() {
        return this.#loop;
    }

    #loop() {
        this.update();
        this._entityList.forEach(e => {
            e.loop();
        });
    }

    update() {
    }

    add(e) {
        this._entityList.push(e);
        return e;
    }

    remove(e) {
        this._entityList = this._entityList.filter(c => c != e);
    }

    _entityList = [];
}

class WeeEntity {
    constructor(x = 0, y = 0) {
    }

    get loop() {
        return this._loop;
    }

    _loop() {
        this.update();
        this.sprite?.render();
    }

    update() {
    }

    sprite;
}

class WeeSprite {
    /**
     * Class for all graphics that can be drawn by Entity.
     * @param {string} asset path to source image
     * @param {number} x start x position to clip from source image
     * @param {number} y start y position to clip from source image
     * @param {number} width width of rectangle to clip from source image. null - for whole image width
     * @param {number} height height of rectangle to clip from source image. null - for whole image height
     * @param {number} frameWidth width of single animation frame. null - for whole image width
     * @param {number} frameHeight height of single animation frame. null - for whole image height
     */
    constructor(asset, x = 0, y = 0, width, height, frameWidth, frameHeight) {
    }

    get render() {
        return this._render;
    }

    _render() {
    }

    static load(path) {
    }

    #bitmap;
    #framesArray = [];
}

export {WeeEntity, WeeGame, WeeSprite, WeeStage};
