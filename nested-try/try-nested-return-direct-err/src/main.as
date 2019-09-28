function main() {
  trace("start");
  try {
    try {
      return "ok";
    } finally {
      throw "err-value";
    }
  } catch (e) {
  }
  trace("end");
  return "end";
}

trace(main());
