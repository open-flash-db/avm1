function f() {
  throw "err-value";
}

function main() {
  trace("start");
  try {
    trace("in-outer-try");
    try {
      trace("in-inner-try");
      return "ok";
    } finally {
      trace("in-inner-finally");
      f();
    }
  } catch (e) {
    trace("in-outer-catch");
  } finally {
    trace("in-outer-finally");
  }
  trace("end");
  return "end";
}

trace(main());
