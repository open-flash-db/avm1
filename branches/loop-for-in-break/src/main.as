var map = {foo: 1, bar: 2, fuz: 3};
trace('before for/in + early break')
for(key in map){
  trace('start of for/in + early break');
  if(key === 'bar'){
    break;
  }
  trace('end of for/in + early break');
}
trace('after for/in + early break')
