import sysPath from "path";

import meta from "./meta.js";

export const PROJECT_ROOT = sysPath.resolve(meta.dirname, "..", "..");
export const DB_DIR = sysPath.join(PROJECT_ROOT, "db");
