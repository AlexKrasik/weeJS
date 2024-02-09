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
        this.ctx.fillStyle = "#111";
        this.ctx.fillRect(0, 0, this._width, this._height);
        // update current stage
        this.stage?.loop();
        requestAnimationFrame((time) => this.loop(time));
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
    debug = false;
}

class WeeStage {
    constructor() {
    }
    get loop() {
        return this._loop;
    }
    _loop() {
        this.update();
        if (this._zOrder) {
            this._entityList = this._entityList.sort((a, b) => (a.z < b.z) ? 1 : -1);
        }
        this._entityList.forEach(e => {
            e.loop();
        });
        if (this.game.debug) {
            const ctx = this.game.ctx;
            this._entityList.forEach(e => {
                //entity hitbox
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.strokeRect(Math.floor(e.x) + .5 + e.originX, Math.floor(e.y) + .5 + e.originY, e.width, e.height);
                // entity position
                ctx.strokeStyle = "#00DDFF";
                ctx.strokeRect(Math.floor(e.x) - .5, Math.floor(e.y) - .5, 2, 2);
            });
        }
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
    get entityList() {
        return this._entityList;
    }
    game = null;
    _zOrder = false;
    reorderZ() {
        this._zOrder = true;
    }
}

class WeeEntity {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    get loop() {
        return this._loop;
    }
    _loop() {
        this.sprite?.render();
        this.update();
    }
    update() {
    }
    _sprite;
    set sprite(s) {
        this._sprite = s;
        this._sprite.entity = this;
    }
    get sprite() {
        return this._sprite;
    }
    /**
     * Check for collision with entity from group
     * @param {string} group collision group
     * @param {number} offsetX X offset of entity hitbox. Use to predict collision
     * @param {number} offsetY Y offset of entity hitbox. Use to predict collision
     */
    collide(group, offsetX = 0, offsetY = 0) {
        const result = [];
        this.stage.entityList.forEach(e => {
            if (e != this && e.group == group) {
                if (this.collideWith(e, offsetX, offsetY))
                    result.push(e);
            }
        });
        return result;
    }
    /**
     * Check for collision with specific entity
     * @param {WeeEntity} e entity to check collision with
     * @param {number} offsetX X offset of entity hitbox. Use to predict collision
     * @param {number} offsetY Y offset of entity hitbox. Use to predict collision
     */
    collideWith(e, offsetX = 0, offsetY = 0) {
        const l1 = this.x + this.originX + offsetX;
        const r1 = this.x + this.originX + offsetX + this.width;
        const t1 = this.y + this.originY + offsetY;
        const b1 = this.y + this.originY + offsetY + this.height;
        const l2 = e.x + e.originX;
        const r2 = e.x + e.originX + e.width;
        const t2 = e.y + e.originY;
        const b2 = e.y + e.originY + e.height;
        return (l1 <= r2 && l2 <= r1 && t1 <= b2 && t2 <= b1);
    }
    /**
     * X position
     */
    x = 0;
    /**
     * Y position
     */
    y = 0;
    /**
     * Z position, defines order in which entities be rendered
     */
    set z(value) {
        this._z = value;
        this.stage?.reorderZ();
    }
    get z() {
        return this._z;
    }
    _z = 0;
    /**
     * hitbox X position
     */
    originX = 0;
    /**
     * hitbox Y position
     */
    originY = 0;
    /**
     * Entity hitbox width
     */
    width = 0;
    /**
     * Entity hitbox height
     */
    height = 0;
    /**
     * Entity hitbox collision group
     */
    group = '';
    /**
     *  Stage this entity belongs to
     */
    stage;
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
        this._fW = this.fillWidth = width < cropWidth ? width || cropWidth : cropWidth;
        this._fH = this.fillHeight = height < cropHeight ? height || cropHeight : cropHeight;
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
        this._fB = this._fA[0];
    }
    get render() {
        return this._render;
    }
    _render() {
        this._updateFrame();
        const ctx = this.entity.stage.game.ctx;
        ctx.save();
        if (this._fB) {
            // renderPont
            const rX = this.entity.x + this.x - this.pivotX;
            const rY = this.entity.y + this.y - this.pivotY;
            ctx.translate(rX, rY);
            if (this.rotation != 0)
                ctx.rotate((this.rotation * Math.PI) / 180);
            if (this.alpha != 1)
                ctx.globalAlpha = this.alpha;
            // render or fill area with frame
            if (this.fillWidth == this._fW && this.fillHeight == this._fH) {
                ctx.drawImage(this?._fB, this.pivotX, this.pivotY);
            }
            else {
                ctx.fillStyle = ctx.createPattern(this._fB, 'repeat');
                ctx.fillRect(this.pivotX, this.pivotY, this.fillWidth, this.fillHeight);
            }
        }
        ctx.restore();
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
        if (time > 1000 / this._aS) {
            this._aT = performance.now();
            this._aI = this._aI >= this._aC.length - 1 ? 0 : this._aI + 1;
        }
        this._fB = this._fA[this._aC[this._aI]];
    }
    static _assets = [];
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
        }
        catch (e) {
            return Promise.reject(`Failed to load image from ${path} \n\t ${e}`);
        }
        finally {
            callback(result);
        }
    }
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
        }
        catch (e) {
            return Promise.reject(`Some assets failed to load`);
        }
        finally {
            callback();
        }
    }
    /**
     * Returns ImageBitmap of loaded asset
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
    // current frame index in animation sequence
    _aI = 0;
    // time from last frame change
    _aT = 0;
    //frame width/height
    _fW;
    _fH;
    // bitmap of current frame in animation sequence
    _fB;
    /**
     * X position
     */
    x = 0;
    /**
     * Y position
     */
    y = 0;
    /**
     * X position of transformation pivot point
     */
    pivotX = 0;
    /**
     * Y position of transformation pivot point
     */
    pivotY = 0;
    /**
     * Image rotation;
     */
    rotation = 0;
    /**
     * Sprite transparency
     */
    alpha = 1;
    /**
     * Width of rectangle to be filled with texture
     */
    fillWidth;
    /**
     * Height of rectangle to be filled with texture
     */
    fillHeight;
}

class WeeInput {
    static _keys = [];
    static init() {
        addEventListener('keydown', e => {
            if (!this._keys[e.code])
                this._defineKey(e.code);
            if (!this._keys[e.code].down)
                this._keys[e.code].pressed = true;
            this._keys[e.code].down = true;
            this._keys[e.code].released = false;
        });
        addEventListener('keyup', e => {
            if (!this._keys[e.code])
                this._defineKey(e.code);
            if (this._keys[e.code].down)
                this._keys[e.code].released = true;
            this._keys[e.code].down = false;
            this._keys[e.code].pressed = false;
        });
        this._clear();
    }
    static _clear() {
        for (const code in this._keys)
            this._keys[code].pressed = this._keys[code].released = false;
        requestAnimationFrame(() => this._clear());
    }
    static _defineKey(code) {
        this._keys[code] = {
            pressed: false, down: false, released: false,
        };
    }
    static pressed(code) {
        if (!this._keys[code])
            this._defineKey(code);
        return this._keys[code].pressed;
    }
    static down(code) {
        if (!this._keys[code])
            this._defineKey(code);
        return this._keys[code].down;
    }
    static released(code) {
        if (!this._keys[code])
            this._defineKey(code);
        return this._keys[code].released;
    }
}

export { WeeEntity, WeeGame, WeeInput, WeeSprite, WeeStage };
