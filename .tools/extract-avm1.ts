import fs from "fs";
import { parseBytes } from "swf-parser";
import { TagType } from "swf-tree/tags/_type";

export async function extractAvm1(absPath: string): Promise<Buffer> {
  const swfBytes = await readFile(absPath);
  const swf = parseBytes(swfBytes);
  for (const tag of swf.tags) {
    if (tag.type === TagType.DoAction) {
      return Buffer.from(tag.actions);
    }
  }
  throw new Error(`DoAction tag not found in: ${absPath}`);
}

async function readFile(absPath: string): Promise<Buffer> {
  return fs.promises.readFile(absPath, {encoding: null});
}
