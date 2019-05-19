/**
 * The goal of this script is to check what happens when redefining a constant
 * pool.
 *
 * The test performs the following steps:
 * - Set constant pool to ["foo", "bar"]
 * - Print the string "trace(c:0)"
 * - Push the constant c:0
 * - Trace
 * - Print the string "trace(c:1)"
 * - Push the constant c:1
 * - Trace
 * - Set constant pool to ["baz"]
 * - Print the string "trace(c:0)"
 * - Push the constant c:0
 * - Trace
 * - Print the string "trace(c:1)"
 * - Push the constant c:1
 * - Trace
 * - Print the string "end"
 *
 * The expected outcomes are:
 * - foo/bar/foo/bar: The constant pool cannot be redefined.
 * - foo/bar/baz/bar: The redefinition overwrites common values and leaves old ones.
 * - foo/bar/baz/undefined: The redefinition replaces the whole pool.
 *
 * Result:
 * - foo/bar/baz/undefined: The redefinition replaces the whole pool.
 */

import { Avm1Emitter } from "avm1-emitter";
import { ActionType } from "avm1-tree/action-type";
import { ValueType } from "avm1-tree/value-type";

const emitter = new Avm1Emitter();

emitter.writeAction({
  action: ActionType.ConstantPool,
  constantPool: ["foo", "bar"],
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
  action: ActionType.ConstantPool,
  constantPool: ["baz"],
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
