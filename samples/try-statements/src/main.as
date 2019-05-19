trace('frame 4: try statement');

// forbidden
/* trace('before try')

try{
	trace('in try')
}

trace('after try')
*/

trace('before try/catch')

try{
  trace('in try')
}catch(err){
  trace('in catch')
}

trace('after try/catch/finally')

trace('before try/catch/finally')

try{
  trace('in try')
}catch(err){
  trace('in catch')
}finally{
  trace('in finally')
}

trace('after try/catch/finally')
