function main() {
  trace("start");
  try {
    trace("try");
    try {
      trace("try-try");
      return "ok";
    } finally {
      trace("try-finally");
      try {
        trace("try-finally-try");
        throw "err-value";
      } finally {
        trace("try-finally-finally");
      }
    }
  } catch (e) {
    trace("catch");
  } finally {
    trace("finally");
  }
  trace("end");
  return "end";
}

trace(main());
