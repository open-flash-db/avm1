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

import { Avm1Emitter } from "avm1-emitter";
import { ActionType } from "avm1-tree/action-type";
import { ValueType } from "avm1-tree/value-type";

const emitter = new Avm1Emitter();

emitter.writeAction({
  action: ActionType.Push,
  values: [{type: ValueType.String, value: "start"}],
});
emitter.writeAction({action: ActionType.Trace});
emitter.writeAction({
  action: ActionType.Push,
  values: [{type: ValueType.Constant, value: 0}],
});
emitter.writeAction({
  action: ActionType.ConstantPool,
  constantPool: ["foo"],
});
emitter.writeAction({action: ActionType.Trace});
emitter.writeAction({
  action: ActionType.Push,
  values: [{type: ValueType.String, value: "end"}],
});
emitter.writeAction({action: ActionType.Trace});

(emitter as any).stream.writeBytes(new Uint8Array([0x00]));

export default emitter.getBytes();
