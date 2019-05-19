function f() {
  trace("err");
  throw "err-value";
}

trace("start");
try {
  f();
  trace("in-try");
} finally {
  trace("in-finally");
  trace(e);
}
trace("end");
