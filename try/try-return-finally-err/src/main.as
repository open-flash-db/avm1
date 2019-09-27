function f() {
  // trace("ok");
  throw "err-value";
}

function main() {
  trace("start");
  try {
    f();
    trace("in-try");
    return "tres";
  } finally {
    trace("in-finally");
    return "fres";
  }
  trace("end");
}

trace(main());
