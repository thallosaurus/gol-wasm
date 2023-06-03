assemblyscript bugs:
- i cant downcast Uint8ClampedArray to Uint8Array, because:
`ERROR TS2304: Cannot find name 'TypedArray'.
    :
 37 │ return this.buffer as TypedArray<u8> as Uint8Array;
    │                       ~~~~~~~~~~
    └─ in assembly/GenerationBuffer.ts(37,31)
`