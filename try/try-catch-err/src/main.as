function f() {
  trace("err");
  throw "err-value";
}

trace("start");
try {
  f();
  trace("in-try");
} catch (e) {
  trace("in-err");
  trace(e);
}
trace("end");
