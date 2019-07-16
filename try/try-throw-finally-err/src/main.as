function f() {
  trace("ok");
  // throw "err-value";
}

function main() {
  trace("start");
  try {
    f();
    trace("in-try");
    throw "terr";
  } finally {
    trace("in-finally");
    throw "ferr";
  }
  trace("end");
}

trace(main());
