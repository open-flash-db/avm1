import { Avm1Emitter } from "avm1-emitter";
import { ActionType } from "avm1-tree/action-type";
import { GetUrl } from "avm1-tree/actions/get-url";
import { ValueType } from "avm1-tree/value-type";
import { movieToBytes } from "swf-emitter";
import { Header, Movie, Tag, TagType, Ufixed8P8 } from "swf-tree";
import { Sfixed16P16 } from "swf-tree/fixed-point/sfixed16p16";
import { TextAlignment } from "swf-tree/text";

export async function getAvm1Bytes(tsModulePath: string): Promise<Uint8Array> {
  return (await import(tsModulePath)).default;
}

const PRINT_TRACE_AVM1_BYTES: Uint8Array = ((): Uint8Array => {
  const emitter = new Avm1Emitter();
  emitter.writeAction({
    action: ActionType.DefineFunction,
    name: "print",
    parameters: ["msg"],
    bodySize: 10,
  });
  emitter.writeAction({ // Size 8
    action: ActionType.Push,
    values: [
      {type: ValueType.String, value: "msg"}, // Size 5
    ],
  });
  emitter.writeAction({action: ActionType.GetVariable}); // Size 1
  emitter.writeAction({action: ActionType.Trace}); // Size 1
  (emitter as any).stream.writeBytes(new Uint8Array([0x00]));
  return emitter.getBytes();
})();

const QUIT_AVM1_BYTES: Uint8Array = ((): Uint8Array => {
  const quitAction: GetUrl = {
    action: ActionType.GetUrl,
    url: "fscommand:quit",
    target: "",
  };
  const emitter = new Avm1Emitter();
  emitter.writeAction(quitAction);
  (emitter as any).stream.writeBytes(new Uint8Array([0x00]));
  return emitter.getBytes();
})();

const PRINT_AVM1_BYTES: Uint8Array = ((): Uint8Array => {
  const emitter = new Avm1Emitter();
  emitter.writeAction({
    action: ActionType.DefineFunction,
    name: "print",
    parameters: ["msg"],
    bodySize: 59,
  });
  emitter.writeAction({ // Size 11
    action: ActionType.Push,
    values: [{type: ValueType.String, value: "stdout"}], // Size 8
  });
  emitter.writeAction({action: ActionType.GetVariable}); // Size 1
  emitter.writeAction({ // Size 9
    action: ActionType.Push,
    values: [{type: ValueType.String, value: "text"}], // Size 6
  });
  emitter.writeAction({ // Size 11
    action: ActionType.Push,
    values: [{type: ValueType.String, value: "stdout"}], // Size 8
  });
  emitter.writeAction({action: ActionType.GetVariable}); // Size 1
  emitter.writeAction({ // Size 9
    action: ActionType.Push,
    values: [{type: ValueType.String, value: "text"}], // Size 6
  });
  emitter.writeAction({action: ActionType.GetMember}); // Size 1
  emitter.writeAction({ // Size 10
    action: ActionType.Push,
    values: [
      {type: ValueType.String, value: "\n"}, // Size 2
      {type: ValueType.String, value: "msg"}, // Size 5
    ],
  });
  emitter.writeAction({action: ActionType.GetVariable}); // Size 1
  emitter.writeAction({action: ActionType.StackSwap}); // Size 1
  emitter.writeAction({action: ActionType.Add2}); // Size 1
  emitter.writeAction({action: ActionType.Add2}); // Size 1
  emitter.writeAction({action: ActionType.SetMember}); // Size 1
  (emitter as any).stream.writeBytes(new Uint8Array([0x00]));
  return emitter.getBytes();
})();

const STOP_AVM1_BYTES: Uint8Array = ((): Uint8Array => {
  const emitter = new Avm1Emitter();
  emitter.writeAction({action: ActionType.Stop});
  (emitter as any).stream.writeBytes(new Uint8Array([0x00]));
  return emitter.getBytes();
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

  return movieToBytes(movie);
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

  return movieToBytes(movie);
}
