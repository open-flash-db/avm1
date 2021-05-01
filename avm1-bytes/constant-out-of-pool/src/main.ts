/**
 * The goal of this script is to check what happens when pushing a constant
 * that has an id outside of the constant pool.
 *
 * The test performs the following steps:
 * - Set constant pool to ["foo"]
 * - Print the string "trace(c:0)"
 * - Push the constant c:0
 * - Trace
 * - Print the string "trace(c:1)"
 * - Push the constant c:1
 * - Trace
 * - Print the string "end"
 *
 * The expected outcomes are:
 * - foo/garbage: Constants outside of the pool are uninitialized memory.
 * - foo/'': Constants outside of the pool are empty strings.
 * - foo/undefined: Constants outside of the pool are `undefined`.
 *
 * Result:
 * - foo/undefined: Constants outside of the pool are `undefined` (or `'undefined'`?).
 */

import { emitAction } from "avm1-emitter";
import { ActionType } from "avm1-types/lib/action-type.js";
import { PushValueType } from "avm1-types/lib/push-value-type.js";
import { WritableStream } from "@open-flash/stream";

const avm1Stream = new WritableStream();

emitAction(avm1Stream, {
  action: ActionType.ConstantPool,
  pool: ["foo"],
});
emitAction(avm1Stream, {
  action: ActionType.Push,
  values: [{type: PushValueType.String, value: "trace(c:0)"}],
});
emitAction(avm1Stream, {action: ActionType.Trace});
emitAction(avm1Stream, {
  action: ActionType.Push,
  values: [{type: PushValueType.Constant, value: 0}],
});
emitAction(avm1Stream, {action: ActionType.Trace});
emitAction(avm1Stream, {
  action: ActionType.Push,
  values: [{type: PushValueType.String, value: "trace(c:1)"}],
});
emitAction(avm1Stream, {action: ActionType.Trace});
emitAction(avm1Stream, {
  action: ActionType.Push,
  values: [{type: PushValueType.Constant, value: 1}],
});
emitAction(avm1Stream, {action: ActionType.Trace});
emitAction(avm1Stream, {
  action: ActionType.Push,
  values: [{type: PushValueType.String, value: "end"}],
});
emitAction(avm1Stream, {action: ActionType.Trace});

avm1Stream.writeBytes(new Uint8Array([0x00]));

export default avm1Stream.getBytes();
