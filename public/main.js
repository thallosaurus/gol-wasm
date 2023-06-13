window.addEventListener("load", (ev) => {
    let canvas = document.querySelector("#canvas").transferControlToOffscreen();

    let worker = new Worker("public/worker.js", {
        type: "module",
    });

    console.log(worker);

    worker.addEventListener("message", (msg) => {
        switch (msg.data.type) {
            case "fps":
                document.querySelector("#fpsCounter").innerText = `${msg.data.payload.fps}FPS`;
                document.querySelector("#idleCounter").innerText = `${msg.data.payload.idle}FPS`;
                break;
        }
    })

    setTimeout(() => {
        worker.postMessage({ canvas }, [canvas]);
    }, 1000);
});