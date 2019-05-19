trace('before for + continue')
for(i = 0; i<2; i++){
  if(i === 0){
    continue;
  }
  trace('in for + continue');
}
trace('after for + continue')