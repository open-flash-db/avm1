import fs from "fs";
import sysPath from "path";

export async function copyFile(src: string, dest: string): Promise<void> {
  await ensureDir(sysPath.dirname(dest));
  return fs.promises.copyFile(src, dest);
}

export async function outputFile(path: string, data: Uint8Array): Promise<void> {
  await ensureDir(sysPath.dirname(path));
  return fs.promises.writeFile(path, data);
}

async function ensureDir(path: fs.PathLike): Promise<void> {
  return fs.promises.mkdir(path, {recursive: true});
}
