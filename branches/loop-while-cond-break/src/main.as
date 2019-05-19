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