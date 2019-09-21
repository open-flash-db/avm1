trace("start");

var foo = undefined;

trace(foo["prototype"]);
trace(foo["__proto__"]);
trace(foo["constructor"]);

trace("end");
