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
        this._lastFrameTime = time;
        //clear canvas
        this._ctx.fillStyle = "#222";
        this._ctx.fillRect(0, 0, this._width, this._height);
        // update current stage
        this._stage?.loop();
        requestAnimationFrame((time) => {
            this.loop(time);
        });
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
     * @param {number} width width of single animation frame. null - for whole image width
     * @param {number} height height of single animation frame. null - for whole image height
     * @param {number} x start x position to clip from source image
     * @param {number} y start y position to clip from source image
     * @param {number} cropWidth width of rectangle to clip from source image. null - for whole image width
     * @param {number} cropHeight height of rectangle to clip from source image. null - for whole image height
     */
    constructor(asset, width, height, x = 0, y = 0, cropWidth, cropHeight) {
    }

    get render() {
        return this._render;
    }

    _render() {
    }

    _bitmap;
    _framesArray = [];

    /**
     * Load a list of game assets. graphics, sounds, etc...
     * @param {string[]} list of path's to source images
     * @param {function} callback function for all list
     * @param {function} step callback function for every asset
     */
    static async loadImageList(list, callback, step) {
        let result;
        try {
            const loadList = list.map(path => {
                return this.loadImage(path, step);
            });
            result = await Promise.allSettled(loadList);
        } catch (e) {
            return Promise.reject(`Some assets failed to load`);
        } finally {
            callback();
        }
        console.log(result);
    }

    /**
     * Load a list of game assets. graphics, sounds, etc...
     * @param {string} path path to source image
     * @param {function} callback function called after loading is finished (or failed)
     */
    static async loadImage(path, callback) {
        let result = false;
        try {
            const response = await fetch(path);
            const blob = await response.blob();
            const bitmap = await createImageBitmap(blob);
            result = true;
            return Promise.resolve(bitmap);
        } catch (e) {
            return Promise.reject(`Failed to load image from ${path} \n\t ${e}`);
        } finally {
            callback(result);
        }
    }
}

export {WeeEntity, WeeGame, WeeSprite, WeeStage};
