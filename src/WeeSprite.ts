export class WeeSprite {
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
    constructor(asset: string, x: number = 0, y: number = 0, width: number, height: number, frameWidth: number, frameHeight: number) {

    }

    get render() {
        return this._render;
    }

    private _render() {

    }

    static load(path) {
    }


    #bitmap: ImageBitmap
    #framesArray: ImageBitmap[] = [];
}