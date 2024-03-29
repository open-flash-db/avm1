import { toAasm } from "avm1-asm/to-aasm";
import { parseCfg } from "avm1-parser";
import { $Cfg, Cfg } from "avm1-types/cfg/cfg";
import fs from "fs";
import { Incident } from "incident";
import { JSON_VALUE_WRITER } from "kryo-json/json-value-writer";
import sysPath from "path";
import rimraf from "rimraf";

import { avm1BytesToSwf, getAvm1Bytes } from "./build-avm1-bytes.js";
import { buildSwf } from "./build-swf-flash-pro.js";
import { buildSwf as buildSwfWithHaxe } from "./build-swf-haxe.js";
import { bytesFromSource } from "./bytes-from-source.js";
import { extractAvm1 } from "./extract-avm1.js";
import { outputFile } from "./helpers.js";
import { DB_DIR, PROJECT_ROOT } from "./locations.js";
import { runSwf } from "./run-all.js";
import { readFile, readTextFile, writeTextFile } from "./utils.js";

const EMPTY_BUFFER: Buffer = Buffer.alloc(0);

const WHITELIST: ReadonlySet<string> = new Set([
  // "wait-for-frame/ready-increments",
  // "wait-for-frame/ready-jump-increments",
  // "wait-for-frame/wff2-ready-increments",
  // "try/try-catch-err-no-jump",
  // "try/try-catch-err-jump-out-try",
  // "try/try-catch-err-jump-catch-try",
  // "try/try-return-finally-ok",
  // "try/try-finally-err-jump-out-try",
  // "try/try-action-on-region-edge",
  // "try/try-nested-return",
  // "try/try-nested-return-direct-err",
  // "try/try-nested-return-indirect",
  // "try/try-nested-return-with-more-traces",
  // "avm1-bytes/end-action-inside-function",
]);

export async function cleanBuild(): Promise<void> {
  // await clean();
  return build();
}

export async function build(): Promise<void> {
  const testItems: TestItem[] = await getTestItems();

  async function buildAs2Items(): Promise<void> {
    const as2Items: TestItem[] = [];
    for (const item of testItems) {
      if (item.src !== undefined && item.src.type === "as2") {
        as2Items.push(item);
      }
    }

    if (as2Items.length === 0) {
      return;
    }

    const flashProFiles: Map<string, string> = new Map();
    for (const item of as2Items) {
      await outputFile(item.swfPath, EMPTY_BUFFER); // Ensure directory exists and permissions are OK
      flashProFiles.set((item.src as As2Source).path, item.swfPath);
    }
    await buildSwf(flashProFiles);
    for (const item of as2Items) {
      try {
        const avm1Bytes: Uint8Array = await extractAvm1(item.swfPath);
        await outputFile(item.avm1Path, Buffer.from(avm1Bytes));
      } catch (err: unknown) {
        throw new Incident(err as Error, "Avm1ExtractionError", item, ({swfPath}) => `Cannot extract AVM1 from ${swfPath}`);
      }
    }
  }

  async function buildHxItems(): Promise<any> {
    const promises: Promise<void>[] = [];
    for (const item of testItems) {
      if (item.src === undefined || item.src.type !== "haxe") {
        continue;
      }
      const src: HaxeSource = item.src;
      promises.push((async () => {
        await buildSwfWithHaxe(src.cwd, src.main, item.swfPath);
        try {
          const avm1Bytes: Uint8Array = await extractAvm1(item.swfPath);
          await outputFile(item.avm1Path, Buffer.from(avm1Bytes));
        } catch (err: unknown) {
          throw new Incident(err as Error, "Avm1ExtractionError", item, ({swfPath}) => `Cannot extract AVM1 from ${swfPath}`);
        }
      })());
    }
    return Promise.all(promises);
  }

  async function buildTsBytesItems(): Promise<any> {
    const promises: Promise<void>[] = [];
    for (const item of testItems) {
      if (item.src === undefined || item.src.type !== "js-bytes") {
        continue;
      }
      promises.push(getAvm1Bytes(item.src.path).then(async (avm1Bytes: Uint8Array) => {
        await outputFile(item.avm1Path, avm1Bytes);
        const swfBytes: Uint8Array = avm1BytesToSwf(avm1Bytes);
        await outputFile(item.swfPath, swfBytes);
      }));
    }
    return Promise.all(promises);
  }

  async function buildTxtBytesItems(): Promise<any> {
    const promises: Promise<void>[] = [];
    for (const item of testItems) {
      if (item.src === undefined || item.src.type !== "txt-bytes") {
        continue;
      }
      promises.push(readTextFile(item.src.path).then(async (sourceText: string) => {
        try {
          const avm1Bytes: Uint8Array = bytesFromSource(sourceText);
          await outputFile(item.avm1Path, avm1Bytes);
          const swfBytes: Uint8Array = avm1BytesToSwf(avm1Bytes);
          await outputFile(item.swfPath, swfBytes);
        } catch (e: unknown) {
          throw Incident(e as Error, "BuildTxtBytesError", {path: item.root});
        }
      }));
    }
    return Promise.all(promises);
  }

  await Promise.all([buildAs2Items(), buildHxItems(), buildTsBytesItems(), buildTxtBytesItems()]);

  for (const item of testItems) {
    const logBuffer: Buffer = await runSwf(item.swfPath);
    await outputFile(item.logPath, logBuffer);
    const avm1Bytes: Uint8Array = await readFile(item.avm1Path);
    try {
      const cfg: Cfg = parseCfg(avm1Bytes);
      const cfgJson: string = JSON.stringify($Cfg.write(JSON_VALUE_WRITER, cfg), null, 2);
      await writeTextFile(item.cfgPath, `${cfgJson}\n`);
      const aasm1: string = toAasm(cfg);
      await writeTextFile(item.aasm1Path, aasm1);
    } catch (err) {
      console.error(item.name);
      console.error(err);
    }
  }
}

export async function clean(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    rimraf(DB_DIR, (err: Error | null | undefined): void => {
      if (err === null || err === undefined) {
        resolve();
      } else {
        reject(err);
      }
    });
  });
}

interface TestItem {
  name: string;
  root: string;
  swfPath: string;
  avm1Path: string;
  logPath: string;
  cfgPath: string;
  aasm1Path: string;
  src?: TestItemSource;
}

type TestItemSource = As2Source | HaxeSource | JsBytesSource | TxtBytesSource;

interface As2Source {
  type: "as2";
  path: string;
}

interface HaxeSource {
  type: "haxe";
  cwd: string;
  main: string;
}

interface JsBytesSource {
  type: "js-bytes";
  path: string;
}

interface TxtBytesSource {
  type: "txt-bytes";
  path: string;
}

async function getTestItems(): Promise<TestItem[]> {
  const items: TestItem[] = [];
  for (const dirEnt of await readdirAsync(PROJECT_ROOT)) {
    if (!dirEnt.isDirectory() || dirEnt.name.startsWith(".") || dirEnt.name === "node_modules") {
      continue;
    }
    const groupName = dirEnt.name;
    const groupPath = sysPath.join(PROJECT_ROOT, groupName);
    for (const dirEnt of await readdirAsync(groupPath)) {
      if (!dirEnt.isDirectory()) {
        continue;
      }
      const name = dirEnt.name;

      const fullName: string = `${groupName}/${name}`;
      if (WHITELIST.size > 0 && !WHITELIST.has(fullName)) {
        continue;
      }

      const root = sysPath.join(groupPath, name);
      const swfPath = sysPath.join(root, "main.swf");
      const avm1Path = sysPath.join(root, "main.avm1");
      const logPath = sysPath.join(root, "main.log");
      const cfgPath = sysPath.join(root, "cfg.json");
      const aasm1Path = sysPath.join(root, "main.aasm1");
      const src = getItemSourceSync(root);
      const item: TestItem = {name, root, swfPath, avm1Path, logPath, cfgPath, aasm1Path, src};
      items.push(item);
    }
  }
  return items;
}

function getItemSourceSync(itemRoot: string): TestItemSource | undefined {
  const srcDir = sysPath.join(itemRoot, "src");
  const jsBytesPath = sysPath.join(srcDir, "main.js");
  const txtBytesPath = sysPath.join(srcDir, "main.txt");
  const asPath = sysPath.join(srcDir, "main.as");
  const hxPath = sysPath.join(srcDir, "Main.hx");
  if (fs.existsSync(jsBytesPath)) {
    return {type: "js-bytes", path: jsBytesPath};
  } else if (fs.existsSync(txtBytesPath)) {
    return {type: "txt-bytes", path: txtBytesPath};
  } else if (fs.existsSync(asPath)) {
    return {type: "as2", path: asPath};
  } else if (fs.existsSync(hxPath)) {
    return {type: "haxe", cwd: srcDir, main: "Main"};
  } else {
    return undefined;
  }
}

async function readdirAsync(dir: fs.PathLike): Promise<fs.Dirent[]> {
  return new Promise<fs.Dirent[]>((resolve, reject): void => {
    fs.readdir(dir, {withFileTypes: true}, (err, files) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

cleanBuild();
