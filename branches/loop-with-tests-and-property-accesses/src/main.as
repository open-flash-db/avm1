trace('before while(if/else if/else if/else)')
var map = {foo: 1, bar: 2};

while(test2){
  if(test){
    trace('in if')
  }else if(test){
    trace('in else if')
  }else{
    trace('in else')
  }
  trace(map.foo);
  i++;
  trace(map.bar);
}


trace('after while(if/else if/else if/else)')
