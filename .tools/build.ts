import fs from "fs";
import { Incident } from "incident";
import sysPath from "path";
import rimraf from "rimraf";
import { avm1BytesToSwf, getAvm1Bytes } from "./build-avm1-bytes";
import { buildSwf } from "./build-swf-flash-pro";
import { extractAvm1 } from "./extract-avm1";
import { outputFile } from "./helpers";
import { DB_DIR } from "./locations";
import meta from "./meta";
import { runSwf } from "./run-all";

const PROJECT_ROOT = sysPath.join(meta.dirname, "..");
const EMPTY_BUFFER: Buffer = Buffer.alloc(0);

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
      flashProFiles.set(item.src!.path, item.swfPath);
    }
    await buildSwf(flashProFiles);
    for (const item of as2Items) {
      try {
        const avm1Bytes: Uint8Array = await extractAvm1(item.swfPath);
        await outputFile(item.avm1Path, Buffer.from(avm1Bytes));
      } catch (err) {
        throw new Incident(err, "Avm1ExtractionError", item, ({swfPath}) => `Cannot extract AVM1 from ${swfPath}`);
      }
    }
  }

  async function buildTsBytesItems(): Promise<any> {
    const promises: Array<Promise<void>> = [];
    for (const item of testItems) {
      if (item.src === undefined || item.src.type !== "ts-bytes") {
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

  await Promise.all([buildAs2Items(), buildTsBytesItems()]);

  for (const item of testItems) {
    const logBuffer: Buffer = await runSwf(item.swfPath);
    await outputFile(item.logPath, logBuffer);
  }
}

export async function clean(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    rimraf(DB_DIR, (err: Error | null): void => {
      if (err !== null) {
        reject(err);
      } else {
        resolve();
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
  src?: TestItemSource;
}

type TestItemSource = As2Source | TsBytesSource;

interface As2Source {
  type: "as2";
  path: string;
}

interface TsBytesSource {
  type: "ts-bytes";
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
      const root = sysPath.join(groupPath, name);
      const swfPath = sysPath.join(root, "main.swf");
      const avm1Path = sysPath.join(root, "main.avm1");
      const logPath = sysPath.join(root, "main.log");
      const src = getItemSourceSync(root);
      const item: TestItem = {name, root, swfPath, avm1Path, logPath, src};
      items.push(item);
    }
  }
  return items;
}

function getItemSourceSync(itemRoot: string): TestItemSource | undefined {
  const srcDir = sysPath.join(itemRoot, "src");
  const tsBytesPath = sysPath.join(srcDir, "main.ts");
  const asPath = sysPath.join(srcDir, "main.as");
  if (fs.existsSync(tsBytesPath)) {
    return {type: "ts-bytes", path: tsBytesPath};
  } else if (fs.existsSync(asPath)) {
    return {type: "as2", path: asPath};
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
