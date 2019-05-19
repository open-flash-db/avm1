trace('before try/catch/finally')

try{
  trace('in try')
}catch(err){
  trace('in catch')
}finally{
  trace('in finally')
}

trace('after try/catch/finally')