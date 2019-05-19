trace('frame 8: misc')

// Forbidden
/*trace('=> trace call with multiple arguments')

trace('arg1', 'arg2')

var part = 'arg2'
trace('... %s', part)*/


// allowed but bugged...
/*trace('=> trace return value')

trace(trace('foo'))
var foo = trace('foo')

trace('=> getMember on litteral string')

trace(('str').length)

var str = 'foo';
trace(str.length)

var fizbuzz = trace('intrace');
trace(fizbuzz);*/

