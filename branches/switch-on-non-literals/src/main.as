trace('before switch on non-literals')

switch(discriminant){
  case foo.bar:
    trace('foo.bar')
  case 2+2:
    trace('foo.bar or 2+2')
    break;
  case bar(foo):
    trace('bar(foo)')
    break;
  default:
    trace('default')
}

trace('after switch on non-literals')
