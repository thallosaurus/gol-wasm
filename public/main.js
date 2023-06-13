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
                document.querySelector("#fpsCounter").innerText = `${msg.data.payload.fps}FPS`;
                document.querySelector("#idleCounter").innerText = `${msg.data.payload.idle}FPS`;
                break;

            case "init":
                worker.postMessage({ type: "init", canvas }, [canvas]);
                break;
        }
    });
});