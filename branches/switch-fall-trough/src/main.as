trace('before switch+fall-trough')

switch(i){
  case 0:
    trace('case 0')
  case 1:
    trace('case 0 or 1')
    break;
  case 2:
    trace('case 2')
    break;
  case 3:
  case 4:
    trace('case 3 or 4')
    break;
  case 5:
    trace('case 5')
    break;
}

trace('after switch+fall-trough')
