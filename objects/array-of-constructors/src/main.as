trace("start");

function Foo() {
  this.name = "foo";
}

function Bar() {
  this.name = "bar";
}

var constructors = [Foo, Bar];
for (var i = 0; i < constructors.length; i++) {
  trace((new constructors[i]()).name);
}

trace("end");
