function f() {
  trace("ok");
  // throw "err-value";
}

function main() {
  trace("start");
  try {
    f();
    trace("in-try");
    return true;
  } finally {
    trace("in-finally");
    return false;
  }
  trace("end");
}

trace(main());
