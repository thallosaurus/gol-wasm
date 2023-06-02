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

        /*this.buffer.forEach((v: u8, i: u32, self: Uint8Array) => {
            //buffer

        });*/
        //console.log(this.buffer.toString());
    }
}