/**
 * The goal of this script is to check what happens when pushing a constant
 * before defining a constant pool.
 *
 * The test performs the following steps:
 * - Print the string "trace(c:0)"
 * - Push the constant c:0
 * - Trace
 * - Print the string "trace(c:1)"
 * - Push the constant c:1
 * - Trace
 * - Print the string "end"
 *
 * The expected outcomes are:
 * - Empty: The invalid constants are eagerly detected as an error and the script is not executed at all.
 * - "trace(c:0)": The VM stops at the first push with an undefined constant.
 * - "trace(c:0)/undefined/trace(c:1)/undefined/end": The missing constants are pushed as `undefined`
 * - "trace(c:0)/''/trace(c:1)/''/end": The missing constants are pushed as empty strings.
 * - "trace(c:0)/garbage/trace(c:1)/garbage/end": The VM pushes uninitialized memory.
 *
 * Result:
 * - "trace(c:0)/garbage/trace(c:1)/garbage/end": The constants are pushed despite pointing to uninitialized memory.
 */

import { Avm1Emitter } from "avm1-emitter";
import { ActionType, ValueType } from "avm1-tree";

const emitter = new Avm1Emitter();

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
