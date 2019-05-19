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

import { Avm1Emitter } from "avm1-emitter";
import { ActionType, ValueType } from "avm1-tree";

const emitter = new Avm1Emitter();

emitter.writeAction({
  action: ActionType.ConstantPool,
  constantPool: ["foo"],
});
emitter.writeAction({
  action: ActionType.Push,
  values: [
    {type: ValueType.Constant, value: 1},
    {type: ValueType.Undefined},
  ],
});
emitter.writeAction({action: ActionType.StrictEquals});
emitter.writeAction({action: ActionType.Trace});
emitter.writeAction({
  action: ActionType.Push,
  values: [
    {type: ValueType.Constant, value: 1},
    {type: ValueType.String, value: "undefined"},
  ],
});
emitter.writeAction({action: ActionType.StrictEquals});
emitter.writeAction({action: ActionType.Trace});
emitter.writeAction({
  action: ActionType.Push,
  values: [{type: ValueType.String, value: "end"}],
});
emitter.writeAction({action: ActionType.Trace});

(emitter as any).stream.writeBytes(new Uint8Array([0x00]));

export default emitter.getBytes();
