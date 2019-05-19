import { Avm1Emitter } from "avm1-emitter";
import { ActionType } from "avm1-tree";
import { emitBytes as emitSwfBytes } from "swf-emitter";
import { Header, Movie, TagType, Ufixed8P8 } from "swf-tree";

export async function getAvm1Bytes(tsModulePath: string): Promise<Uint8Array> {
  return (await import(tsModulePath)).default;
}

const QUIT_AVM1_BYTES: Uint8Array = ((): Uint8Array => {
  const emitter = new Avm1Emitter();
  emitter.writeAction({
    action: ActionType.GetUrl,
    url: "fscommand:quit",
    target: "",
  });
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

  return emitSwfBytes(movie);
}
