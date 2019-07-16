function f() {
  trace("ok");
  throw "err";
}

function main() {
  trace("start");
  try {
    f();
    trace("in-try");
    throw "terr";
  } catch(e) {
    trace("in-catch");
    throw "cerr";
  } finally {
    trace("in-finally");
    throw "ferr";
  }
  trace("end");
}

trace(main());
