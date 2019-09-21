// Example of allowed joined objects from ECMA 262-3, section 11.3
// The spec allows `b1` and `b2` to be joined so they are indistinguishable from user code.
// The cases using `eval` were removed as `eval` has different semantics in ActionScript 2.

function A() {
  function B(x) {return x*x;}
  return B;
}

var b1 = A();
var b2 = A();
function b3(x) {return x*x;}
function b4(x) {return x*x;}

trace(b1 == b2); // Implementation defined: either `true` or `false`
trace(b3 == b4); // Must be `false` (different source text)
