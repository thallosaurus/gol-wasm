import { Console } from "as-wasi/assembly";
import { ALIVE } from ".";

export default class GenerationBuffer {
    public buffer: Uint8ClampedArray;

    constructor(w: u32, h: u32) {
        this.buffer = new Uint8ClampedArray(w * h);
    }

    public addGeneration(buf: Uint8Array): void {
        if (buf.length != this.buffer.length) throw new Error("Generations Size doesn't match buffer size");

        for (let i = 0; i < this.buffer.length; i++) {
            let v = buf[i];
            
            if (buf[i] == ALIVE) {
                this.buffer[i] = v * 255;
            } else {
                this.buffer[i] -= 5;
            }

        }
    }
    public getAsUint8(): Uint8Array {
        let c = new Uint8Array(this.buffer.length);
        let dv = new DataView(c.buffer);

        for (let i = 0; i < this.buffer.length; i++) {
            dv.setUint8(i, this.buffer[i]);
        }

/*        Console.log(this.buffer.toString());
        Console.log(c.byteLength.toString());*/

        //c.set(this.buffer);
        return c;
    }
}