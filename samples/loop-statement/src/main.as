trace('frame 7: loop statements');

var i = 0;
trace('before while')
while(i<2){
  trace('in while')
  i++;
}
trace('after while')

i = 0;
trace('before do/while')
do{
  trace('in do/while')
  i++;
}while(i<2)
trace('after do/while')

trace('before for')
for(i = 0; i<2; i++){
  trace('in for');
}
trace('after for')

var map = {foo: 1, bar: 2};
trace('before for/in')
for(var key in map){
  trace('in for/in')
}
trace('after for/in')

i = 0;
trace('before while + break')
while(i<4){
  trace('in while + break')
  i++;
  if(i >= 2){
    break;
  }
}
trace('after while + break')

i = 0;
trace('before  while/true + break')
while(true){
  trace('in  while/true + break')
  i++;
  if(i >= 2){
    break;
  }
}
trace('after while/true + break')

i = 0;
trace('before for/true + break')
for(;;){
  trace('in for/true + break');
  i += 2;
  if(i >= 2){
    break;
  }
}
trace('after for/true + break')

trace('before for + continue')
for(i = 0; i<2; i++){
  if(i === 0){
    continue;
  }
  trace('in for + continue');
}
trace('after for + continue')


