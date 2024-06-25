# wasm-gol
A WebAssembly PoC written in [AssemblyScript](https://www.assemblyscript.org)

## Prerequisites
- Node.Js (Tested on v22)

## Getting Started
1. Clone the Repo and change to it
2. Run "npm install" to install all dependencies
3. To run the development environment, run `npm run asbuild:release` to build it
4. and `npm run start` to start the local dev server. If it wants to install `serve`, accept it by typing `y`.
5. Open your browser and go to `http://localhost:3000` and watch the Game of Life unfold!

## Features
- Click on the canvas to randomize the squares
- FPS Counter that counts the time between idle and workload

## Observations
I found out that this code runs nearly twice as fast on Apple Devices. I dont know what that means but its interesting.
