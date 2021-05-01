import cp from "child_process";
import sysPath from "path";

import { emitJsfl } from "./emit-jsfl.js";
import { outputFile } from "./helpers.js";
import { PROJECT_ROOT } from "./locations.js";

const IS_DEBUG: boolean = true;
const JSFL_PATH = sysPath.join(PROJECT_ROOT, ".tools", "build.jsfl");
const FLASH_PATH = sysPath.join(PROJECT_ROOT, "flash.sh");

export async function buildSwf(files: Iterable<[string, string]>): Promise<void> {
  await outputJsfl(files);
  return execFlashPro([sysPath.relative(PROJECT_ROOT, JSFL_PATH)], PROJECT_ROOT);
}

async function outputJsfl(files: Iterable<[string, string]>): Promise<void> {
  const jsfl: string = emitJsfl(files);
  return outputFile(JSFL_PATH, Buffer.from(jsfl));
}

async function execFlashPro(args: ReadonlyArray<string>, cwd: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const proc: cp.ChildProcess = cp.spawn(FLASH_PATH, args, {cwd, env: {...process.env}});
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
      const outStr: string = Buffer.concat(outChunks).toString("utf-8");
      const errStr: string = Buffer.concat(errChunks).toString("utf-8");
      const error: Error = new Error("SubprocessError");
      // tslint:disable-next-line:prefer-object-spread
      reject(Object.assign(error, {out: outStr, err: errStr, cause: err}));
    });

    proc.once("exit", (code: number, signal: string | null): void => {
      if (completed) {
        return;
      }
      completed = true;
      const outStr: string = Buffer.concat(outChunks).toString("utf-8");
      const errStr: string = Buffer.concat(errChunks).toString("utf-8");
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
