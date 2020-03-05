import { emitAction } from "avm1-emitter";
import { ActionType } from "avm1-types/action-type";
import { GetUrl } from "avm1-types/actions/get-url";
import { PushValueType } from "avm1-types/push-value-type";
import { emitSwf } from "swf-emitter";
import { Header, Movie, Tag, TagType, Ufixed8P8 } from "swf-types";
import { Sfixed16P16 } from "swf-types/fixed-point/sfixed16p16";
import { TextAlignment } from "swf-types/text";
import { WritableStream } from "@open-flash/stream";

export async function getAvm1Bytes(tsModulePath: string): Promise<Uint8Array> {
  return (await import(tsModulePath)).default;
}

const PRINT_TRACE_AVM1_BYTES: Uint8Array = ((): Uint8Array => {
  const avm1Stream = new WritableStream();
  emitAction(avm1Stream, {
    action: ActionType.DefineFunction,
    name: "print",
    parameters: ["msg"],
    bodySize: 10,
  });
  emitAction(avm1Stream, { // Size 8
    action: ActionType.Push,
    values: [
      {type: PushValueType.String, value: "msg"}, // Size 5
    ],
  });
  emitAction(avm1Stream, {action: ActionType.GetVariable}); // Size 1
  emitAction(avm1Stream, {action: ActionType.Trace}); // Size 1
  avm1Stream.writeBytes(new Uint8Array([0x00]));
  return avm1Stream.getBytes();
})();

const QUIT_AVM1_BYTES: Uint8Array = ((): Uint8Array => {
  const quitAction: GetUrl = {
    action: ActionType.GetUrl,
    url: "fscommand:quit",
    target: "",
  };
  const avm1Stream = new WritableStream();
  emitAction(avm1Stream, quitAction);
  avm1Stream.writeBytes(new Uint8Array([0x00]));
  return avm1Stream.getBytes();
})();

const PRINT_AVM1_BYTES: Uint8Array = ((): Uint8Array => {
  const avm1Stream = new WritableStream();
  emitAction(avm1Stream, {
    action: ActionType.DefineFunction,
    name: "print",
    parameters: ["msg"],
    bodySize: 59,
  });
  emitAction(avm1Stream, { // Size 11
    action: ActionType.Push,
    values: [{type: PushValueType.String, value: "stdout"}], // Size 8
  });
  emitAction(avm1Stream, {action: ActionType.GetVariable}); // Size 1
  emitAction(avm1Stream, { // Size 9
    action: ActionType.Push,
    values: [{type: PushValueType.String, value: "text"}], // Size 6
  });
  emitAction(avm1Stream, { // Size 11
    action: ActionType.Push,
    values: [{type: PushValueType.String, value: "stdout"}], // Size 8
  });
  emitAction(avm1Stream, {action: ActionType.GetVariable}); // Size 1
  emitAction(avm1Stream, { // Size 9
    action: ActionType.Push,
    values: [{type: PushValueType.String, value: "text"}], // Size 6
  });
  emitAction(avm1Stream, {action: ActionType.GetMember}); // Size 1
  emitAction(avm1Stream, { // Size 10
    action: ActionType.Push,
    values: [
      {type: PushValueType.String, value: "\n"}, // Size 2
      {type: PushValueType.String, value: "msg"}, // Size 5
    ],
  });
  emitAction(avm1Stream, {action: ActionType.GetVariable}); // Size 1
  emitAction(avm1Stream, {action: ActionType.StackSwap}); // Size 1
  emitAction(avm1Stream, {action: ActionType.Add2}); // Size 1
  emitAction(avm1Stream, {action: ActionType.Add2}); // Size 1
  emitAction(avm1Stream, {action: ActionType.SetMember}); // Size 1
  avm1Stream.writeBytes(new Uint8Array([0x00]));
  return avm1Stream.getBytes();
})();

const STOP_AVM1_BYTES: Uint8Array = ((): Uint8Array => {
  const avm1Stream = new WritableStream();
  emitAction(avm1Stream, {action: ActionType.Stop});
  avm1Stream.writeBytes(new Uint8Array([0x00]));
  return avm1Stream.getBytes();
})();

const HEADER: Header = {
  swfVersion: 30,
  frameSize: {
    xMin: 0,
    xMax: 11000,
    yMin: 0,
    yMax: 8000,
  },
  frameRate: Ufixed8P8.fromValue(30),
  frameCount: 2,
};

export function avm1BytesToSwf(avm1Bytes: Uint8Array): Uint8Array {
  const movie: Movie = {
    header: HEADER,
    tags: [
      {
        type: TagType.DoAction,
        actions: PRINT_TRACE_AVM1_BYTES,
      },
      {
        type: TagType.DoAction,
        actions: avm1Bytes,
      },
      {
        type: TagType.ShowFrame,
      },
      {
        type: TagType.DoAction,
        actions: QUIT_AVM1_BYTES,
      },
      {
        type: TagType.ShowFrame,
      },
    ],
  };

  return emitSwf(movie);
}

export function avm1BytesToThrottledSwf(avm1Bytes: Uint8Array): Uint8Array {
  const tags: Tag[] = [
    {
      type: TagType.SetBackgroundColor,
      color: {r: 0x7f, g: 0x7f, b: 0xff},
    },
    {
      type: TagType.DefineDynamicText,
      id: 1,
      bounds: {
        xMin: 0,
        yMin: 0,
        xMax: 12800,
        yMax: 9600,
      },
      wordWrap: true,
      multiline: true,
      password: false,
      readonly: true,
      autoSize: true,
      noSelect: true,
      border: false,
      wasStatic: false,
      html: false,
      useGlyphFont: false,
      align: TextAlignment.Left,
      marginLeft: 0,
      marginRight: 0,
      indent: 0,
      leading: 0,
      // variableName: "stdout",
      text: "",
    },
    {
      type: TagType.PlaceObject,
      isUpdate: false,
      depth: 1,
      characterId: 1,
      name: "stdout",
      matrix: {
        scaleX: Sfixed16P16.fromValue(1),
        scaleY: Sfixed16P16.fromValue(1),
        rotateSkew0: Sfixed16P16.fromValue(0),
        rotateSkew1: Sfixed16P16.fromValue(0),
        translateX: 0,
        translateY: 0,
      },
    },
    {
      type: TagType.DoAction,
      actions: PRINT_AVM1_BYTES,
    },
    {
      type: TagType.ShowFrame,
    },
    {
      type: TagType.DoAction,
      actions: avm1Bytes,
    },
    {
      type: TagType.ShowFrame,
    },
    {
      type: TagType.DoAction,
      actions: avm1Bytes,
    },
    {
      type: TagType.ShowFrame,
    },
    {
      type: TagType.DoAction,
      actions: STOP_AVM1_BYTES,
    },
    {
      type: TagType.ShowFrame,
    },
  ];

  const movie: Movie = {
    header: {
      swfVersion: 30,
      frameSize: {
        xMin: 0,
        xMax: 11000,
        yMin: 0,
        yMax: 8000,
      },
      frameRate: Ufixed8P8.fromValue(1),
      frameCount: tags.reduce((c: number, t: Tag) => t.type === TagType.ShowFrame ? c + 1 : c, 0),
    },
    tags,
  };

  return emitSwf(movie);
}
