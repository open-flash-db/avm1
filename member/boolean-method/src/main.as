trace("start");

Boolean.prototype["not"] = function () {
  trace(this);
  return !this.valueOf();
};

var falsy = false;
var truthy = true;

trace(Boolean.prototype["not"]);
trace(falsy["not"]);
trace(truthy["not"]);
trace(falsy["not"]());
trace(truthy["not"]());

trace("end");
