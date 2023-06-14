window.addEventListener("load", (ev) => {
    let c = document.querySelector("#canvas");

    c.addEventListener("click", () => {
        worker.postMessage({
            type: "randomize"
        });
    });

    let canvas = c.transferControlToOffscreen();

    let worker = new Worker("public/worker.js", {
        name: "ui",
        type: "module",
    });

    worker.addEventListener("message", (msg) => {
        switch (msg.data.type) {
            case "fps":
                document.querySelector("#fpsCounter").innerText = msg.data.payload.fps;
                document.querySelector("#idleCounter").innerText = msg.data.payload.idle;
                break;

            case "init":
                let newWorld = new Uint8Array(255 * 255).map((v, i) => {
                    return (i & 1) ? 1 : 0;
                });
                worker.postMessage({ type: "init", canvas, data: newWorld, width: 255, height: 255 }, [canvas]);
                break;
        }
    });
});