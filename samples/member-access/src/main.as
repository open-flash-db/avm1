trace('frame 6: member access')

var obj = {};

obj.foo = 'bar';
obj["foo"] = 'bar';
var foo = "foo";
obj[foo] = 'bar';

trace(obj.foo);
