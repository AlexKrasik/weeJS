import {WeeEntity} from "./WeeEntity";

export class WeeSprite {
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
    constructor(asset: string, width: number, height: number, x: number = 0, y: number = 0, cropWidth, cropHeight) {
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

    private async _cacheFrames() {
        const rCount = (this._bitmap.height - (this._bitmap.height % this._fH)) / this._fH;
        const cCount = (this._bitmap.width - (this._bitmap.width % this._fW)) / this._fW;

        let frameCount = 0;

        for (let y = 0; y < rCount; y++) {
            for (let x = 0; x < cCount; x++) {
                this._fA[frameCount] = await createImageBitmap(
                    this._bitmap,
                    x * this._fW,
                    y * this._fH,
                    this._fW,
                    this._fH
                );
                frameCount++;
            }
        }
        this._fC = this._fA[0];
    }

    get render() {
        return this._render;
    }

    private _render() {
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

    private _updateFrame() {
        const time = performance.now() - this._aT;
        if (time > 100 / this._aS) {
            this._aT = performance.now();
            this._aI = this._aI >= this._aC.length - 1 ? 0 : this._aI + 1;
        }
        this._fC = this._fA[this._aC[this._aI]];
    }


    static _assets: ImageBitmap[] = [];

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
    static getAsset(path: string) {
        return this._assets[path];
    }

    // entity this sprite assigned to
    entity: WeeEntity = null;
    // bitmapData of sprite
    private _bitmap: ImageBitmap;
    // array of frames bitmap
    private _fA: ImageBitmap[] = [];
    // sequence of current animation
    private _aC: number[] = [0]
    // current animation speed
    private _aS: number = 1;
    // current frame index in current animation sequence
    private _aI: number = 0;
    // time from last frame change
    private _aT: number = 0;
    //frame width
    private readonly _fW: number;
    //frame height
    private readonly _fH: number;
    // current frames bitmap of animation
    private _fC: ImageBitmap

}