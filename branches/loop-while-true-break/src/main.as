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