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
        this.ctx = canvasEl.getContext('2d');
        // start main loop
        this.loop(0);
    }
    loop(time) {
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
    set stage(s) {
        this._stage = s;
        this._stage.game = this;
    }

    get stage() {
        return this._stage;
    }

    get elapsed() {
        return this._elapsed;
    }

    _width;
    _height;
    _elapsed;
    _lastFrameTime = 0;
    _stage = null;
    ctx = null;
}

class WeeStage {
    constructor() {
    }

    get loop() {
        return this._loop;
    }

    _loop() {
        this.update();
        this._entityList.forEach(e => {
            e.loop();
        });
    }

    update() {
    }
    add(e) {
        this._entityList.push(e);
        e.stage = this;
        return e;
    }
    remove(e) {
        this._entityList = this._entityList.filter(c => c != e);
    }

    _entityList = [];
    game = null;
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

    stage;
    _sprite;
    set sprite(s) {
        this._sprite = s;
        this._sprite.entity = this;
    }

    get sprite() {
        return this._sprite;
    }
}

class WeeSprite {
    /**
     * Class for all graphics that can be drawn by Entity.
     * @param {string} asset path to source image
     * @param {number} width width of single animation frame. null - for whole image width
     * @param {number} height height of single animation frame. null - for whole image height
     * @param {number} x start x position to clip from source image
     * @param {number} y start y position to clip from source image
     * @param {number} [cropWidth] width of rectangle to clip from source image. null - for whole image width
     * @param {number} [cropHeight] height of rectangle to clip from source image. null - for whole image height
     */
    constructor(asset, width, height, x = 0, y = 0, cropWidth, cropHeight) {
        const srcBitmap = WeeSprite.getAsset(asset);
        cropWidth = cropWidth || srcBitmap.width - x;
        cropHeight = cropHeight || srcBitmap.height - y;
        this._fW = width < cropWidth ? width || cropWidth : cropWidth;
        this._fH = height < cropHeight ? height || cropHeight : cropHeight;
        createImageBitmap(srcBitmap, x, y, cropWidth, cropHeight).then((clippedBitmap) => {
            this._bitmap = clippedBitmap;
            this._cacheFrames();
        });
    }

    async _cacheFrames() {
        const rCount = (this._bitmap.height - (this._bitmap.height % this._fH)) / this._fH;
        const cCount = (this._bitmap.width - (this._bitmap.width % this._fW)) / this._fW;
        let frameCount = 0;
        for (let y = 0; y < rCount; y++) {
            for (let x = 0; x < cCount; x++) {
                this._fA[frameCount] = await createImageBitmap(this._bitmap, x * this._fW, y * this._fH, this._fW, this._fH);
                frameCount++;
            }
        }
        this._fC = this._fA[0];
    }

    get render() {
        return this._render;
    }

    _render() {
        this._updateFrame();
        const ctx = this.entity.stage.game.ctx;
        if (this._fC)
            ctx?.drawImage(this._fC, 0, 0);
    }

    /**
     * Play animation sequence
     * @param {number[]} animation sequence of frames
     * @param {number} speed sequence of frames
     */
    play(animation = [0], speed = 1) {
        this._aC = animation;
        this._aT = performance.now();
        this._aS = speed;
        this._aI = 0;
    }

    _updateFrame() {
        const time = performance.now() - this._aT;
        if (time > 100 / this._aS) {
            this._aT = performance.now();
            this._aI = this._aI >= this._aC.length - 1 ? 0 : this._aI + 1;
        }
        this._fC = this._fA[this._aC[this._aI]];
    }

    static _assets = [];

    /**
     * Preload a list of images
     * @param {string[]} list of path's to source images
     * @param {function} [callback] function for all list
     * @param {function} [step] callback function for every asset
     */
    static async loadImageList(list, callback, step) {
        try {
            const loadList = list.map(path => {
                return this.loadImage(path, step);
            });
            return await Promise.allSettled(loadList);
        } catch (e) {
            return Promise.reject(`Some assets failed to load`);
        } finally {
            callback();
        }
    }

    /**
     * Preload a single image
     * @param {string} path path to source image
     * @param {function} [callback] function called after loading is finished (or failed)
     */
    static async loadImage(path, callback) {
        let result = false;
        try {
            const response = await fetch(path);
            const blob = await response.blob();
            const bitmap = await createImageBitmap(blob);
            this._assets[path] = bitmap;
            result = true;
            return Promise.resolve(bitmap);
        } catch (e) {
            return Promise.reject(`Failed to load image from ${path} \n\t ${e}`);
        } finally {
            callback(result);
        }
    }

    /**
     * Load a list of game assets. graphics, sounds, etc...
     * @param {string} path path to source image
     */
    static getAsset(path) {
        return this._assets[path];
    }

    // entity this sprite assigned to
    entity = null;
    // bitmapData of sprite
    _bitmap;
    // array of frames bitmap
    _fA = [];
    // sequence of current animation
    _aC = [0];
    // current animation speed
    _aS = 1;
    // current frame index in current animation sequence
    _aI = 0;
    // time from last frame change
    _aT = 0;
    //frame width
    _fW;
    //frame height
    _fH;
    // current frames bitmap of animation
    _fC;
}

export {WeeEntity, WeeGame, WeeSprite, WeeStage};
