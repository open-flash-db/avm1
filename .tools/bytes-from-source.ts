export function bytesFromSource(text: string): Uint8Array {
  if (text.startsWith("# bin\n")) {
    return bytesFromBinSource(text);
  } else {
    return bytesFromHexSource(text);
  }
}

function bytesFromHexSource(text: string): Uint8Array {
  const clean: string = text
    .replace(/#[\S\s]*?(?:\n|$)/g, "")
    .replace(/[^0-9a-f]/g, "");
  if (clean.length % 2 !== 0) {
    throw new Error("InvalidHexSource: symbol count must be a multiple of 2");
  }
  return Buffer.from(clean, "hex");
}

function bytesFromBinSource(text: string): Uint8Array {
  const clean: string = text
    .replace(/#[\S\s]*?(?:\n|$)/g, "")
    .replace(/[^01]/g, "");
  if (clean.length % 8 !== 0) {
    throw new Error("InvalidBinSource: symbol count must be a multiple of 8");
  }
  const len: number = clean.length / 8;
  const bytes: Buffer = Buffer.alloc(len);
  for (let i: number = 0; i < len; i++) {
    let byte: number = 0;
    for (let j: number = 0; j < 8; j++) {
      if (clean[8 * i + j] === "1") {
        byte |= 1 << (7 - j);
      }
    }
    bytes[i] = byte;
  }
  return bytes;
}
