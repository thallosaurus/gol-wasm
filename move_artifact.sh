#!/bin/sh
mkdir -p out/build
cp index.html out
cp build/release.wasm out/build/
cp build/release.js out/build/
cp build/wasi.wasm out/build/

mkdir -p out/build/public
cp -r public/ out/build/