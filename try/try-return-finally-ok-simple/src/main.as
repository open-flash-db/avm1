function main() {
  trace("start");
  try {
    trace("in-try");
    return "tres";
  } finally {
    trace("in-finally");
    return "fres";
  }
  trace("end");
}

trace(main());
