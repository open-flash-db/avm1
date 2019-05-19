i = 0;
trace('before do/while/true')
do{
  trace('in do/while/true')
  if(i > 2){
    break;
  }
  i++;
}while(true)
trace('after do/while/true')