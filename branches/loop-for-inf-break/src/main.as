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