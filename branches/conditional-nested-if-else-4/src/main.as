trace('before hyper-nested if/else')

if(test){
  if(test){
    if(test){
      if(test){
        trace('in hyper-nested if/else 1111')
      }else{
        trace('in hyper-nested if/else 1110')
      }
    }else{
      if(test){
        trace('in hyper-nested if/else 1101')
      }else{
        trace('in hyper-nested if/else 1100')
      }
    }
  }else{
    if(test){
      if(test){
        trace('in hyper-nested if/else 1011')
      }else{
        trace('in hyper-nested if/else 1010')
      }
    }else{
      if(test){
        trace('in hyper-nested if/else 1001')
      }else{
        trace('in hyper-nested if/else 1000')
      }
    }
  }
}else{
  if(test){
    if(test){
      if(test){
        trace('in hyper-nested if/else 0111')
      }else{
        trace('in hyper-nested if/else 0110')
      }
    }else{
      if(test){
        trace('in hyper-nested if/else 0101')
      }else{
        trace('in hyper-nested if/else 0100')
      }
    }
  }else{
    if(test){
      if(test){
        trace('in hyper-nested if/else 0011')
      }else{
        trace('in hyper-nested if/else 0010')
      }
    }else{
      if(test){
        trace('in hyper-nested if/else 0001')
      }else{
        trace('in hyper-nested if/else 0000')
      }
    }
  }
}

trace('after hyper-nested if/else')