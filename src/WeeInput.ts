export class WeeInput {
    private static _keys = [];

    static init() {
        addEventListener('keydown', e => {
            if (!this._keys[e.code]) this._defineKey(e.code);
            if (!this._keys[e.code].down) this._keys[e.code].pressed = true;
            this._keys[e.code].down = true;
            this._keys[e.code].released = false;
        });
        addEventListener('keyup', e => {
            if (!this._keys[e.code]) this._defineKey(e.code);
            if (this._keys[e.code].down) this._keys[e.code].released = true;
            this._keys[e.code].down = false;
            this._keys[e.code].pressed = false;
        });
    }

    static _clear() {
        for (const code in this._keys) this._keys[code].pressed = this._keys[code].released = false;
    }

    private static _defineKey(code) {
        this._keys[code] = {
            pressed: false, down: false, released: false,
        }
    }

    static pressed(code) {
        if (!this._keys[code]) this._defineKey(code);
        return this._keys[code].pressed;
    }

    static down(code) {
        if (!this._keys[code]) this._defineKey(code);
        return this._keys[code].down;
    }

    static released(code) {
        if (!this._keys[code]) this._defineKey(code);
        return this._keys[code].released;
    }
}
