export default class GenerationBuffer {
    private buffer: Uint8Array;

    constructor(w: u32, h: u32) {
        this.buffer = new Uint8Array(w * h);
    }

    public addGeneration(buf: Uint8Array): void {
        if (buf.length != this.buffer.length) throw new Error("Generations Size doesn't match buffer size");

        buf.forEach((v: u8, i: u32) => {
            //buffer
        });
    }
}