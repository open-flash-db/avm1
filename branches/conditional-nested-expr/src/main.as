trace('before nested conditionnal expression')

var foo = test ? 'bar' : (test2 ? 'baz' : 'fuz');

trace('after nested conditionnal expression')
