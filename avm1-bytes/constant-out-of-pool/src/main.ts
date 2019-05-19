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

import { Avm1Emitter } from "avm1-emitter";
import { ActionType, ValueType } from "avm1-tree";

const emitter = new Avm1Emitter();

emitter.writeAction({
  action: ActionType.ConstantPool,
  constantPool: ["foo"],
});
emitter.writeAction({
  action: ActionType.Push,
  values: [{type: ValueType.String, value: "trace(c:0)"}],
});
emitter.writeAction({action: ActionType.Trace});
emitter.writeAction({
  action: ActionType.Push,
  values: [{type: ValueType.Constant, value: 0}],
});
emitter.writeAction({action: ActionType.Trace});
emitter.writeAction({
  action: ActionType.Push,
  values: [{type: ValueType.String, value: "trace(c:1)"}],
});
emitter.writeAction({action: ActionType.Trace});
emitter.writeAction({
  action: ActionType.Push,
  values: [{type: ValueType.Constant, value: 1}],
});
emitter.writeAction({action: ActionType.Trace});
emitter.writeAction({
  action: ActionType.Push,
  values: [{type: ValueType.String, value: "end"}],
});
emitter.writeAction({action: ActionType.Trace});

(emitter as any).stream.writeBytes(new Uint8Array([0x00]));

export default emitter.getBytes();
