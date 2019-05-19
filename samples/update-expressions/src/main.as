trace('frame 9: update expressions')

i++;
trace('after increment')

++i;
trace('after prefixed increment')

i--;
trace('after decrement')

--i;
trace('after prefixed decrement')

j = i++;
trace('after increment + assignment')

j = ++i;
trace('after prefixed increment + assignment')

j = i--;
trace('after decrement + assignment')

j = --i;
trace('after prefixed decrement + assignment')
