/**
 * Use a sequence generating all 4-byte bit-patterns, trace the first items
 * by interpreting them as float32 values.
 */

import { WritableStream } from "@open-flash/stream";

const bytes = new Uint8Array(4);
const view = new DataView(bytes.buffer);

const actionStream = new WritableStream();

/**
 * Linear congruential generator generating all 32-bit patterns.
 */
class Lcm32 {
  #state: number;

  constructor() {
    this.#state = 0;
  }

  public next(): number {
    const m: number = 2 ** 32;
    const a: number = 1664525;
    const c: number = 1013904223;

    const state: number = this.#state;
    this.#state = (a * state + c) % m;

    return state;
  }
}

const lcm = new Lcm32();
for (let i: number = 0; i < 1000; i++) {
  // size: 9 bytes
  actionStream.writeBytes(new Uint8Array([0x96, 0x05, 0x00])); // push, len: 9 bytes
  actionStream.writeBytes(new Uint8Array([0x01])); // push: type -> Float32
  view.setUint32(0, lcm.next(), true);
  actionStream.writeBytes(new Uint8Array(bytes)); // push the 4 bytes of the float
  actionStream.writeBytes(new Uint8Array([0x26])); // trace
}

export default actionStream.getBytes();
