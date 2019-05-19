trace('before while(if/else if/else if/else)')

while(test2){
  if(test){
    trace('in if')
  }else if(test){
    trace('in else if')
  }else{
    trace('in else')
  }
  i++;
}


trace('after while(if/else if/else if/else)')
