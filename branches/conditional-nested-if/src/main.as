trace("before nested if");

if(test){
  if(test){
    trace("in nested if");
  }
}

trace("after nested if");
