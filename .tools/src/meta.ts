import * as furi from "furi";

export default {
  dirname: furi.toSysPath(furi.join(import.meta.url, ".."), true),
};
