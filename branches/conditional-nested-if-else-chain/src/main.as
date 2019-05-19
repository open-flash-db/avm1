trace('before if(if/else if/else)')

if(test){
  if(test2){
    trace('in if(if)')
  }else if(test3){
    trace('in if(else if)')
  }else{
    trace('in if(else)')
  }
}


trace('after if(if/else if/else)')
