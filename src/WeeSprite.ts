export class WeeSprite {
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
    constructor(asset: string, width: number, height: number, x: number = 0, y: number = 0, cropWidth: number, cropHeight: number) {

    }

    get render() {
        return this._render;
    }

    private _render() {

    }

    private _bitmap: ImageBitmap;
    private _framesArray: ImageBitmap[] = [];

    /**
     * Load a list of game assets. graphics, sounds, etc...
     * @param {string[]} list of path's to source images
     * @param {function} callback function for all list
     * @param {function} step callback function for every asset
     */
    static async loadImageList(list, callback, step) {
        let result
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