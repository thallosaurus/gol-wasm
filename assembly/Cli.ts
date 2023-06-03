import {
    wasi_process
} from "@assemblyscript/wasi-shim/assembly/wasi_process";

import {
    wasi_Date as Date
} from "@assemblyscript/wasi-shim/assembly/wasi_date";

//import { wasi_crypto } from '@assemblyscript/wasi-shim/assembly/wasi_crypto';

import { randomize, buffer, iterate, ALIVE, DEAD, setWorld, getAsStringDebug, getWorldPointer, getGenerationBufferPointer, getGenerationBuffer, setWorldSize } from "./GameOfLife";
//import styles from 'ansi-styles';
// ANSI Escape
const ESC: string = "\u001b";
const RESET: string = ESC + "[" + "0m";
const FG = "38";
const BG = "48";
const CLEAR = ESC + "[2J";
const HOME = ESC + "[H";
const TEST = ESC + "[=" + ESC + "[=19hh"
const HIDE_CURSOR = ESC + "[?25l";
const SHOW_CURSOR = ESC + "[?25h";

export function main(): void {
    //parseArguments(CommandLine.all);
    setWorldSize(238, 67);
    randomize();
    //Console.log(d.toString());
    write(CLEAR);
    write(HIDE_CURSOR);
    let running = true;

    let lastRun = Date.now();
    while (running) {
        if (lastRun + 10 < Date.now()) {
            lastRun = Date.now();

            /*let stdin = Descriptor.Stdin.read();
            if (stdin) {
                Console.log(stdin.toString());
            }*/

            iterate();

            //Console.write(HOME, false);
            write(HOME);
            //Console.log(getGenerationBuffer().toString());
            //streamBuffer(buffer, getGenerationBuffer());
            write(bufferToAnsi(buffer, getGenerationBuffer()));
        }
        //Console.write(RESET);
        write(RESET);
    }


    //Console.write(ESC + "[48;2;2;3;99 179m Select RGB foreground color", false);
}

function streamBuffer(fgbuf: Uint8Array, bgbuf: Uint8Array): void {
    for (let i = 0; i < fgbuf.length; i++) {
        //process background
        let bg_val = bgbuf.at(i);
        let fg_val = fgbuf.at(i);
        //let char_ = fg_val == ALIVE ? "*" : " ";

        //Console.write(getColorCell(fg_val, bg_val), false);
    }
}

function bufferToAnsi(fgbuf: Uint8Array, bgbuf: Uint8Array): string {
    let str = "";

    for (let i = 0; i < fgbuf.length; i++) {
        //process background
        let bg_val = bgbuf.at(i);
        let fg_val = fgbuf.at(i);

        str += getColorCell(fg_val, bg_val);
    }
    return str;
}

function getColorCell(fg: u8, bg: u8): string {
    let char_ = fg == ALIVE ? "*" : " ";
    if (bg > 0) {
        return rgbToAnsi(char_, 0, 0, fg, bg, bg, bg);
    } else {
        return " ";
    }
}

function rgbToAnsi(msg: string, fr: u8, fg: u8, fb: u8, br: u8, bg: u8, bb: u8): string {
    return ESC + "[1;34;"
        + ESC + "[" + FG + ";2;" + fr.toString() + ";" + fg.toString() + ";" + fb.toString() + "m"
        + ESC + "[" + BG + ";2;" + br.toString() + ";" + bg.toString() + ";" + bb.toString() + "m"
        + msg;
}

/**
 * WASI-Abort
 * @param param0 
 * @param param1 
 * @param param2 
 * @param param3 
*/
// @ts-ignore: decorator
@global
export function wasiabort(param0: i32, param1: i32, param2: i32, param3: i32): void {
    //Console.log(param0.toString() + param1.toString() + param2.toString() + param3.toString());
}

// @ts-ignore: decorator
@global
export function seed(): f64 {
    /*let v = new Uint8Array(4);
    wasi_crypto.getRandomValues(v);
    let view = new DataView(v.buffer);
    return view.getFloat64(0);*/

    return 0.03;
}

/**
 * WASI Entry Point
*/
// @ts-ignore: decorator
@global
export function _start(): void {
    main();
}

declare interface ParsedArgument {
    key: string,
    value: string
}

function parseArguments(str: Array<string>): void /* Array<ParsedArgument> */ {
    //Console.log(str.toString());
}

let stderr = wasi_process.stderr;

function write(msg: string): void {
    stderr.write(msg);
}