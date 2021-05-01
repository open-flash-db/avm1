/**
 * The goal of this script is to improve the results of `constant-out-of-pool`
 * and pin down the type of the value used when pushing constants outside of
 * the current pool.
 *
 * The test performs the following steps:
 * - Set constant pool to ["foo"]
 * - Push [c:1, undefined]
 * - StrictEquals
 * - Trace
 * - Push [c:1, "undefined"]
 * - StrictEquals
 * - Trace
 * - Print the string "end"
 *
 * The expected outcomes are:
 * - true/false: The placeholder constant is the `undefined` value.
 * - false/true: The placeholder constant is the string literal `"undefined"`.
 * - false/false: The placeholder is neither `undefined` or `"undefined"`.
 * - true/true: Should be impossible (unless something is deeply broken...).
 *
 * Result:
 * - true/false: The placeholder constant is the `undefined` value.
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
  values: [
    {type: PushValueType.Constant, value: 1},
    {type: PushValueType.Undefined},
  ],
});
emitAction(avm1Stream, {action: ActionType.StrictEquals});
emitAction(avm1Stream, {action: ActionType.Trace});
emitAction(avm1Stream, {
  action: ActionType.Push,
  values: [
    {type: PushValueType.Constant, value: 1},
    {type: PushValueType.String, value: "undefined"},
  ],
});
emitAction(avm1Stream, {action: ActionType.StrictEquals});
emitAction(avm1Stream, {action: ActionType.Trace});
emitAction(avm1Stream, {
  action: ActionType.Push,
  values: [{type: PushValueType.String, value: "end"}],
});
emitAction(avm1Stream, {action: ActionType.Trace});

avm1Stream.writeBytes(new Uint8Array([0x00]));

export default avm1Stream.getBytes();
