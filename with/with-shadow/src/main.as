function f(x, o) {
  trace(x);
  with (o) {
    trace(x);
  }
}

trace("start");
trace("shadow");
f("outer", {x: "inner"});
trace("no-shadow");
f("outer", {});
trace("end");
