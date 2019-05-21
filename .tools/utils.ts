import fs from "fs";

export async function readTextFile(filePath: fs.PathLike): Promise<string> {
  return new Promise<string>((resolve, reject): void => {
    fs.readFile(filePath, {encoding: "UTF-8"}, (err: NodeJS.ErrnoException | null, data: string): void => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export async function readFile(filePath: fs.PathLike): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject): void => {
    fs.readFile(filePath, {encoding: null}, (err: NodeJS.ErrnoException | null, data: Buffer): void => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export async function writeTextFile(filePath: fs.PathLike, text: string): Promise<void> {
  return new Promise<void>((resolve, reject): void => {
    fs.writeFile(filePath, text, (err: NodeJS.ErrnoException | null): void => {
      if (err !== null) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
