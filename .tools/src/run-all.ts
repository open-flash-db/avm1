import childProcess from "child_process";
import fs from "fs";
import os from "os";
import sysPath from "path";
import rimraf from "rimraf";
import { PROJECT_ROOT } from "./locations.js";

const FLASHPLAYER_PATH = "flashplayerdebugger";
const FLASHLOG_PATH = sysPath.resolve(os.homedir(), ".macromedia/Flash_Player/Logs/flashlog.txt");

export async function main() {
  await run("db/add");
  await run("db/constant-on-stack-definition");
  await run("db/constant-on-stack-redefinition");
  await run("db/constant-out-of-pool");
  await run("db/constant-redefinition");
  await run("db/constant-without-pool");
  await run("db/hello-world");
  await run("db/if-else-false");
  await run("db/if-else-true");
  await run("db/if-false");
  await run("db/if-true");
  await run("db/object-access");
  await run("db/misaligned-jump");
  await run("db/samples/01");
  await run("db/samples/02");
  await run("db/samples/03");
}

async function run(relPath: string): Promise<void> {
  await writeFile(sysPath.resolve(PROJECT_ROOT, `${relPath}.log`), await runSwf(sysPath.resolve(PROJECT_ROOT, `${relPath}.swf`)));
}

interface ExecFileError extends Error {
  code: number;
  killed: boolean;
}

export async function runSwf(absPath: string): Promise<Buffer> {
  await cleanFlashLog();
  return new Promise<Buffer>((resolve, reject) => {
    childProcess.execFile(
      FLASHPLAYER_PATH,
      [absPath],
      {cwd: PROJECT_ROOT, timeout: 20000},
      (internalErr: Error | null, _stdout: string | Buffer, _stderr: string | Buffer): void => {
        const err: ExecFileError | null = internalErr as any;
        if (err === null || err.code === 1) {
          resolve(readFlashLog());
          return;
        }
        if (err.killed) {
          reject(new Error(`Spawned flashplayer timed-out: ${absPath}`));
        } else {
          reject(new Error(`Unexpected result for spawned flashplayer: ${absPath}: ${err}`));
        }
      },
    );
  });
}

async function cleanFlashLog(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    rimraf(FLASHLOG_PATH, (err: Error | null): void => {
      if (err !== null) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function readFlashLog(): Promise<Buffer> {
  return fs.promises.readFile(FLASHLOG_PATH, {encoding: null});
}

async function writeFile(absPath: string, data: Buffer): Promise<void> {
  return fs.promises.writeFile(absPath, data);
}
