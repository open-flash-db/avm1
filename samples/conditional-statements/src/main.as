trace('frame 3: conditionnal statements');

var test = true;

trace('before if')

if(test){
  trace('in if')
}

trace('after if')

trace('before if/else')

if(test){
  trace('in if')
}else{
  trace('in else')
}

trace('after if/else')

var test = true;

trace('before nested if')

if(test){
  if(test){
    trace('in nested if')
  }
}

trace('after nested if')

var test2 = false;
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

trace('after nested if')

trace('before conditionnal expression')

var foo = test ? 'bar' : 'baz';

trace('after conditionnal expression')

