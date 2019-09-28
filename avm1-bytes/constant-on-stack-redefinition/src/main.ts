/**
 * The goal of this script is to check what happens when a constant is redefined
 * while it is on the stack.
 *
 * The test performs the following steps:c
 * - Print the string "start"
 * - Set constant pool to ["foo"]
 * - Push the constant c:0
 * - Set constant pool to ["bar"]
 * - Trace
 * - Print the string "end"
 *
 * The expected outcomes are:
 * - foo: The value is resolved when writing to the stack during `push` (eager).
 * - bar: The value is resolved when reading from the stack during `trace` (lazy).
 *
 * Result:
 * - foo: The value is resolved when writing to the stack during `push` (eager).
 */

import { Avm1Emitter } from "avm1-emitter";
import { ActionType } from "avm1-types/action-type";
import { ValueType } from "avm1-types/value-type";

const emitter = new Avm1Emitter();

emitter.writeAction({
  action: ActionType.Push,
  values: [{type: ValueType.String, value: "start"}],
});
emitter.writeAction({action: ActionType.Trace});
emitter.writeAction({
  action: ActionType.ConstantPool,
  constantPool: ["foo"],
});
emitter.writeAction({
  action: ActionType.Push,
  values: [{type: ValueType.Constant, value: 0}],
});
emitter.writeAction({
  action: ActionType.ConstantPool,
  constantPool: ["bar"],
});
emitter.writeAction({action: ActionType.Trace});
emitter.writeAction({
  action: ActionType.Push,
  values: [{type: ValueType.String, value: "end"}],
});
emitter.writeAction({action: ActionType.Trace});

(emitter as any).stream.writeBytes(new Uint8Array([0x00]));

export default emitter.getBytes();
