trace("start");

Object.prototype["bar"] = function () {
  trace(this);
  return !this.valueOf();
};

var foo = undefined;

trace(foo["bar"]);
trace(foo["bar"]());

trace("end");
