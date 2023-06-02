// export declare function logInteger(i: i32): void;

@external("env", "requestAnimationFrame")
export declare function requestAnimationFrame(callback: (ts: i32) => void): void;

/*
requestAnimationFrame((ts: i32) => {

})
*/