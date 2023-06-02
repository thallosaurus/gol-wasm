import GenerationBuffer from "./GenerationBuffer";

// The entry file of your WebAssembly module.
let WIDTH: u32 = 0;
let HEIGHT: u32 = 0;

export let buffer = new Uint8Array(WIDTH * HEIGHT);
let genBuffer = new GenerationBuffer(WIDTH, HEIGHT);
export const ALIVE: u8 = 1;
export const DEAD: u8 = 0;

export function iterate(): void {
  let copy = new Uint8Array(buffer.length);
  copy.set(buffer);

  for (let y: u8 = 0; y < HEIGHT; y++) {
    for (let x: u8 = 0; x < WIDTH; x++) {

      let i = toIndex(x, y);
      let cell = copy[i];

      //find neighbors
      let neighbors: u8 = 0;
      for (let yy = -1; yy < 2; yy++) {
        for (let xx = -1; xx < 2; xx++) {

          let newIndex = ((y + yy) * WIDTH) + (x + xx);
          if (newIndex < buffer.length && newIndex >= 0) {
            neighbors += buffer[newIndex]
          }
        }
      }

      if (neighbors > 0) {
        neighbors -= cell;
      }

      let dv = new DataView(copy.buffer);
      dv.setUint8(i, rules(cell, neighbors));
    }
  }

  buffer.set(copy);
  genBuffer.addGeneration(copy);
}

function rules(cell: u8, neighbors: u8): u8 {
  if (cell == ALIVE && neighbors < 2) {
    return DEAD;
  } else if (cell == ALIVE && neighbors > 3) {
    return DEAD;
  } else if (cell == DEAD && neighbors === 3) {
    return ALIVE;
  } else {
    return cell;
  }
}

function toIndex(x: u8, y: u8): u32 {
  if (x > WIDTH) x = 0;
  if (y > HEIGHT) y = 0;

  return ((y) * WIDTH) + (x);
}

export function randomize(): void {
  buffer.forEach((v, i, self) => {
    if (Math.random() > 0.5) {
      self[i] = ALIVE;
    } else {
      self[i] = DEAD;
    }
  });
}

export function setWorld(preset: Uint8Array): void {
  if (preset.length != buffer.length) throw new Error(`Preset size doesn't match world size (${WIDTH}/${HEIGHT})`);
  buffer.set(preset);
}

export function setWorldSize(w: u32, h: u32): void {
  WIDTH = w;
  HEIGHT = h;
  buffer = new Uint8Array(WIDTH * HEIGHT);
  genBuffer = new GenerationBuffer(w, h);
}

export function getWorldPointer(): usize {
  return buffer.dataStart;
}

export function getAsString(): string {
  let str = "";

  for (let y: u8 = 0; y < HEIGHT; y++) {
    for (let x: u8 = 0; x < WIDTH; x++) {
      let v = buffer[toIndex(x, y)];
      str += (v == ALIVE ? "◼" : "▢");
    }
    str += "\n";
  }

  return str;
}

export function getGenerationBufferPointer(): usize {
  return genBuffer.buffer.dataStart;
}