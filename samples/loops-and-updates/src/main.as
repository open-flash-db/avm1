var i;
trace('decrement suffix')

i = 5;

while(i-- > 0){
  trace(i)
}
trace(i)

// ifFrameLoaded

trace('decrement prefix')

i = 5;

while(--i > 0){
  trace(i)
}
trace(i)

var a  = function(){

  var i;
  trace('decrement suffix')

  i = 5;

  while(i-- > 0){
    trace(i)
  }
  trace(i)


  trace('decrement prefix')

  i = 5;

  while(--i > 0){
    trace(i)
  }
  trace(i)

}

var map = {i: 5};
trace('decrement suffix')

while(map.i-- > 0){
  trace(map.i)
}
trace(map.i)


trace('decrement prefix')

map.i = 5;

while(--map.i > 0){
  trace(map.i)
}
trace(map.i)


