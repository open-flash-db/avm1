import cp from "child_process";
import sysPath from "path";
import { emitJsfl } from "./emit-jsfl";
import { outputFile } from "./helpers";
import { PROJECT_ROOT } from "./locations";

const IS_DEBUG: boolean = true;
const JSFL_PATH = sysPath.join(PROJECT_ROOT, ".tools", "build.jsfl");

export async function buildSwf(files: Iterable<[string, string]>): Promise<void> {
  await outputJsfl(files);
  return execFlashPro([sysPath.relative(PROJECT_ROOT, JSFL_PATH)], PROJECT_ROOT);
}

async function outputJsfl(files: Iterable<[string, string]>): Promise<void> {
  const jsfl: string = emitJsfl(files);
  return outputFile(JSFL_PATH, Buffer.from(jsfl));
}

async function execFlashPro(args: ReadonlyArray<string>, cwd: string): Promise<void> {
  const WINEPREFIX: string = "/opt/wine/adobe-cs6";
  const FLASH_PRO_PATH: string = "/opt/wine/adobe-cs6/drive_c/Program Files/Adobe/Adobe Flash CS6/Flash.exe";

  return new Promise<void>((resolve, reject) => {
    const proc: cp.ChildProcess = cp.spawn("wine", [FLASH_PRO_PATH, ...args], {cwd, env: {...process.env, WINEPREFIX}});
    const outChunks: Buffer[] = [];
    const errChunks: Buffer[] = [];

    proc.stdout!.on("data", (chunk: Buffer): void => {
      outChunks.push(chunk);
    });
    proc.stderr!.on("data", (chunk: Buffer): void => {
      errChunks.push(chunk);
    });

    if (IS_DEBUG) {
      proc.stdout!.pipe(process.stdout);
      proc.stderr!.pipe(process.stderr);
    }

    let completed: boolean = false;

    proc.once("error", (err: Error): void => {
      if (completed) {
        return;
      }
      completed = true;
      const outStr: string = Buffer.concat(outChunks).toString("UTF-8");
      const errStr: string = Buffer.concat(errChunks).toString("UTF-8");
      const error: Error = new Error("SubprocessError");
      // tslint:disable-next-line:prefer-object-spread
      reject(Object.assign(error, {out: outStr, err: errStr, cause: err}));
    });

    proc.once("exit", (code: number, signal: string | null): void => {
      if (completed) {
        return;
      }
      completed = true;
      const outStr: string = Buffer.concat(outChunks).toString("UTF-8");
      const errStr: string = Buffer.concat(errChunks).toString("UTF-8");
      if (code === 0 && signal === null) {
        resolve();
      } else {
        const error: Error = new Error(`EndError\n${errStr}`);
        // tslint:disable-next-line:prefer-object-spread
        reject(Object.assign(error, {out: outStr, err: errStr, code, signal}));
      }
    });
  });
}
