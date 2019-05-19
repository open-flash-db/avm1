var map = {foo: 1, bar: 2};
trace('before for/in')
for(key in map){
  trace('in for/in')
}
trace('after for/in')
