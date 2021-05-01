/**
 * The goal of this script is to check what happens when a constant is pushed
 * and only then defined.
 *
 * The test performs the following steps:c
 * - Print the string "start"
 * - Push the constant c:0
 * - Set constant pool to ["foo"]
 * - Trace
 * - Print the string "end"
 *
 * The expected outcomes are:
 * - garbage: The value is resolved when writing to the stack during `push` (eager).
 * - foo: The value is resolved when reading from the stack during `trace` (lazy).
 *
 * Result:
 * - garbage: The value is resolved when writing to the stack during `push` (eager).
 */

import { emitAction } from "avm1-emitter";
import { ActionType } from "avm1-types/lib/action-type.js";
import { PushValueType } from "avm1-types/lib/push-value-type.js";
import { WritableStream } from "@open-flash/stream";

const avm1Stream = new WritableStream();

emitAction(avm1Stream, {
  action: ActionType.Push,
  values: [{type: PushValueType.String, value: "start"}],
});
emitAction(avm1Stream, {action: ActionType.Trace});
emitAction(avm1Stream, {
  action: ActionType.Push,
  values: [{type: PushValueType.Constant, value: 0}],
});
emitAction(avm1Stream, {
  action: ActionType.ConstantPool,
  pool: ["foo"],
});
emitAction(avm1Stream, {action: ActionType.Trace});
emitAction(avm1Stream, {
  action: ActionType.Push,
  values: [{type: PushValueType.String, value: "end"}],
});
emitAction(avm1Stream, {action: ActionType.Trace});

avm1Stream.writeBytes(new Uint8Array([0x00]));

export default avm1Stream.getBytes();
