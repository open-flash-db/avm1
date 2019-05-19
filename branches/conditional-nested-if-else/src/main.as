trace('before nested if/else')

if(test){
  if(test){
    trace('in nested if/else 1')
  }else{
    trace('in nested if/else 2')
  }
}else{
  if(test){
    trace('in nested if/else 3')
  }else{
    trace('in nested if/else 4')
  }
}

trace('after nested if/else')