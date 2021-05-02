/**
 * Use a sequence generating all 8-byte bit-patterns, trace the first items
 * by interpreting them as float64 values.
 */

import { WritableStream } from "@open-flash/stream";

const bytes = new Uint8Array(8);
const view = new DataView(bytes.buffer);

const actionStream = new WritableStream();

/**
 * Linear congruential generator generating all 64-bit patterns.
 */
class Lcm64 {
  #state: bigint;

  constructor() {
    this.#state = 0n;
  }

  public next(): bigint {
    const m: bigint = 2n ** 64n;
    const a: bigint = 6364136223846793005n;
    const c: bigint = 1442695040888963407n;

    const state: bigint = this.#state;
    this.#state = (a * state + c) % m;

    return state;
  }
}

const lcm = new Lcm64();
for (let i: number = 0; i < 1000; i++) {
  // size: 13 bytes
  actionStream.writeBytes(new Uint8Array([0x96, 0x09, 0x00])); // push, len: 9 bytes
  actionStream.writeBytes(new Uint8Array([0x06])); // push: type -> Float64
  view.setBigUint64(0, lcm.next(), true);
  actionStream.writeBytes(new Uint8Array(bytes)); // push the 8 bytes of the float
  actionStream.writeBytes(new Uint8Array([0x26])); // trace
}

export default actionStream.getBytes();
