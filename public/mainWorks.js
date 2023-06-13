import { memory, randomize, buffer, iterate, ALIVE, DEAD, setWorld, getAsStringDebug, getWorldPointer, getGenerationBufferPointer, setWorldSize } from "gol-wasm";
// window.addEventListener("load", (ev) => {
const canvas = document.querySelector("#precanvas");
const ctx = document.querySelector("#canvas").getContext("2d");
//const div = document.querySelector("div:has(pre)");
const controls = document.querySelector("#controls");
const fpscounter = document.querySelector("#fpsCounter");

let mouseX = 0;
let mouseY = 0;

const TILE_WIDTH = 4;
const TILE_HEIGHT = 4;

const w = 255;
const h = 255;

let mode = document.querySelector("input[name='mode']:checked").id;

ctx.canvas.width = w * TILE_WIDTH;
ctx.canvas.height = h * TILE_HEIGHT;

ctx.canvas.addEventListener("click", (ev) => {
    randomize();
});

ctx.canvas.addEventListener("mousemove", (ev) => {
    mouseX = ev.clientX;
    mouseY = ev.clientY;
    console.log(mouseX / ctx.canvas.width, mouseY);
})

controls.addEventListener("change", (ev) => {
    console.log(ev.target.id);

    mode = ev.target.id;
});

window.addEventListener("keyup", (ev) => {
    iterate();
});


let framecount = 0;
const targetFps = 60;
const intervalFps = 1000 / targetFps;
let lastRun = Date.now();

let avg = [];

const loop = (ts) => {
    // if (Date.now() > lastRun + 10) {
    // framecount++;
    iterate();
    // }

    // lastRun = Date.now();
    let elapsed = Date.now() - lastRun;

    if (elapsed > intervalFps) {
        lastRun = Date.now();

        if (mode == "can") {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            //shadows
            let shadows = new DataView(memory.buffer, getGenerationBufferPointer());
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < h; x++) {
                    let i = (y * w) + x;
                    //console.log(
                    let v = shadows.getUint8(i);
                    let v_f = v / 255;
                    //if (v == ALIVE) {
                    let r = Math.sin(ts / 1000) * v_f;
                    let g = Math.cos(ts / 1000) * v_f;
                    let b = Math.tan(ts / 1000) * v_f;
                    let c = `rgba(${255}, ${255}, ${255}, ${v_f})`;

                    ctx.fillStyle = c;
                    //console.log(c);
                    ctx.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
                }
            }

            let dv = new DataView(memory.buffer, getWorldPointer());
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < h; x++) {
                    let i = (y * w) + x;
                    //console.log(
                    let v = dv.getUint8(i);
                    if (v == ALIVE) {
                        ctx.fillStyle = "blue";
                        ctx.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
                    }
                }
            }
        } else {
            //let mem = memory
            canvas.innerText = getAsString();
        }

        framecount++;
        // if (fpscounter) {
        // fpscounter.innerText = avg.reduce((p, c, i, arr) => {
        //     // console.log(p, c, i, arr);
        //     return p + c;
        // }, 0);
        // }
    }

    requestAnimationFrame(loop);
}

setInterval(() => {
    fpscounter.innerText = framecount + "FPS";
    //     // console.log(p, c, i, arr);
    //     return p + c;
    // }, 0);
    framecount = 0;
    // if (avg.length > 10) {
    // avg.shift();
    // }
    // avg.push(framecount);
}, 1000);

//randomize();
//setTimeout(() => {
/*let newWorld = new Uint8Array(63 * 64).map((v, i) => {
    //console.log(i & 1);
    return (i & 1) ? ALIVE : DEAD;
});

console.log(newWorld);

setWorld(newWorld);*/
//}, 10000);


setWorldSize(w, h);
//randomize();

let newWorld = new Uint8Array(w * h).map((v, i) => {
    //console.log(i & 1);
    return (i & 1) ? ALIVE : DEAD;
});
setWorld(newWorld);

console.log(getWorldPointer());
requestAnimationFrame(loop);