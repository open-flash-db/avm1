function f() {
  trace("ok");
  // throw "err-value";
}

trace("start");
try {
  f();
  trace("in-try");
} finally {
  trace("in-finally");
}
trace("end");
