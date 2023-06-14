import { memory, randomize, iterate, ALIVE, getWorldPointer, getGenerationBufferPointer, setWorldSize, setWorld } from "../build/release.js";
//const { memory, randomize, buffer, iterate, ALIVE, DEAD, setWorld, getAsStringDebug, getWorldPointer, getGenerationBufferPointer, setWorldSize } = import("../build/release.js");

const TILE_WIDTH = 4;
const TILE_HEIGHT = 4;

let MAP_WIDTH = 0;
let MAP_HEIGHT = 0;

let ctx = null;
let framecount = 0;
let idleCounter = 0;
const targetFps = 60;
const intervalFps = 1000 / targetFps;
let lastRun = performance.now();

let fullCount = 0;

self.addEventListener("message", (msg) => {
    switch (msg.data.type) {
        case "init":
            let c = msg.data.canvas;

            ctx = c.getContext("2d");
            MAP_WIDTH = msg.data.width;
            MAP_HEIGHT = msg.data.height;

            c.width = MAP_WIDTH * TILE_WIDTH;
            c.height = MAP_HEIGHT * TILE_HEIGHT;

            setWorldSize(msg.data.width, msg.data.height);
            if (msg.data.data) {
                setWorld(msg.data.data);
            } else {
                randomize();
            }

            break;

        case "randomize":
            randomize();
            break;

        case "world":
            setWorldSize(msg.data.width, msg.data.height);
            setWorld(msg.data.data);
            break;

        default:
            console.log(msg);
            break;
    }
});

const loop = (ts) => {
    requestAnimationFrame(loop);
    let elapsed = performance.now() - lastRun;

    if (ctx && elapsed > intervalFps) {
        iterate();
        lastRun = performance.now();

        //requestAnimationFrame(drawToCanvas);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        //shadows
        let shadows = new DataView(memory.buffer, getGenerationBufferPointer());
        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_HEIGHT; x++) {
                let i = (y * MAP_WIDTH) + x;
                let v = shadows.getUint8(i);
                let v_f = v / 255;

                let c = `rgba(${255}, ${255}, ${255}, ${v_f})`;

                ctx.fillStyle = c;
                ctx.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
            }
        }

        let dv = new DataView(memory.buffer, getWorldPointer());
        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_HEIGHT; x++) {
                let i = (y * MAP_WIDTH) + x;
                let v = dv.getUint8(i);
                if (v == ALIVE) {
                    ctx.fillStyle = "blue";
                    ctx.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
                }
            }
        }
        framecount++;
    }
    idleCounter++;
    fullCount++;
}

setInterval(() => {
    postMessage({
        type: "fps",
        payload: {
            fps: framecount,
            idle: idleCounter
        }
    });

    framecount = 0;
    idleCounter = 0;
}, 1000);

requestAnimationFrame(loop);

postMessage({ type: "init" });