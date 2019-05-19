/**
 * The goal of this script is to check what happens when a branch instruction
 * jumps to the middle of an action instead of its start.
 * The jumps are measured in bytes and most actions are multi-byte, so it is
 * possible to have offsets pointing to the middle of actions.
 *
 * The test performs the following steps:
 * - It prints the string "start"
 * - It encodes `jump to print-end` and pushes it on the stack, using some padding if needed
 * - It jumps inside the previous push action, trying to execute the embedded instructions
 * - It prints the string "hidden"
 * - it prints the string "end"
 *
 * The expected outcomes are:
 * - Empty: The invalid offset is eagerly detected as an error and the script is not executed at all.
 * - "start": The code stops at the invalid branch.
 * - "start/end": The invalid jump was executed.
 * - "start/hidden/end": The code skipped the invalid jump.
 *
 * Result:
 * - "start/end": The misaligned jump is executed and control flow continues from there.
 */

import { WritableStream } from "@open-flash/stream";

const actionStream = new WritableStream();

{
  // size: 11 bytes
  actionStream.writeBytes(new Uint8Array([0x96, 0x07, 0x00])); // push, len: 7 bytes
  actionStream.writeBytes(new Uint8Array([0x00])); // push: type -> string
  actionStream.writeBytes(new Uint8Array([0x73, 0x74, 0x61, 0x72, 0x74, 0x00])); // push: value -> "start\0"
  actionStream.writeBytes(new Uint8Array([0x26])); // trace
}

{
  // size: 10 bytes
  actionStream.writeBytes(new Uint8Array([0x96, 0x07, 0x00])); // push, len: 7 bytes
  actionStream.writeBytes(new Uint8Array([0x07])); // push: type -> int
  actionStream.writeBytes(new Uint8Array([0x99, 0x02, 0x00, 0x12])); // push: value (jump + 18)
  actionStream.writeBytes(new Uint8Array([0x00])); // push: type -> string
  actionStream.writeBytes(new Uint8Array([0x00])); // push: value -> "\0"
}

{
  // size: 5 bytes
  actionStream.writeBytes(new Uint8Array([0x99, 0x02, 0x00, 0xf5, 0xff])); // jump -11
}

{
  // size: 12 bytes
  actionStream.writeBytes(new Uint8Array([0x96, 0x08, 0x00])); // push, len: 8 bytes
  actionStream.writeBytes(new Uint8Array([0x00])); // push: type -> string
  actionStream.writeBytes(new Uint8Array([0x68, 0x69, 0x64, 0x64, 0x65, 0x6e, 0x00])); // push: value -> "hidden\0"
  actionStream.writeBytes(new Uint8Array([0x26])); // trace
}

{
  // size: 9 bytes
  actionStream.writeBytes(new Uint8Array([0x96, 0x05, 0x00])); // push, len: 5 bytes
  actionStream.writeBytes(new Uint8Array([0x00])); // push: type -> string
  actionStream.writeBytes(new Uint8Array([0x65, 0x6e, 0x64, 0x00])); // push: value -> "end\0"
  actionStream.writeBytes(new Uint8Array([0x26])); // trace
}
// actionStream.writeBytes(new Uint8Array([0x00])); // end-of-actions

export default actionStream.getBytes();
