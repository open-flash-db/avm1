function f() {
  throw "err-value";
}

function main() {
  trace("start");
  try {
    try {
      return "ok";
    } finally {
      f();
    }
  } catch (e) {
  }
  trace("end");
}

trace(main());
