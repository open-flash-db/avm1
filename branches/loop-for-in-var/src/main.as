var map = {foo: 1, bar: 2};
trace('before for/in + assignment')
for(var key in map){
  trace('in for/in + assignment')
}
trace('after for/in + assignment')
