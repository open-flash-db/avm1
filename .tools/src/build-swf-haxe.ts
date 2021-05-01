import cp from "child_process";

const IS_DEBUG: boolean = true;

export async function buildSwf(cwd: string, main: string, outPath: string): Promise<void> {
  return execHaxe(["-main", main, "-swf", outPath, "-swf-version", "8"], cwd);
}

async function execHaxe(args: ReadonlyArray<string>, cwd: string): Promise<void> {
  const HAXE_PATH: string = "haxe";

  return new Promise<void>((resolve, reject) => {
    const proc: cp.ChildProcess = cp.spawn(HAXE_PATH, [...args], {cwd});
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
