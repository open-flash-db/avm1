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

import { emitAction } from "avm1-emitter";
import { ActionType } from "avm1-types/action-type";
import { PushValueType } from "avm1-types/push-value-type";
import { WritableStream } from "@open-flash/stream";

const avm1Stream = new WritableStream();

emitAction(avm1Stream, {
  action: ActionType.ConstantPool,
  pool: ["foo", "bar"],
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
  action: ActionType.ConstantPool,
  pool: ["baz"],
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
