trace('before parseDataString')

lproto.parseDataString = function ( str ){
  if (str == null){
    this.showError(this.getStaticText(64));
    return;
  }
  while (true){
    var lastChar = str.charAt(str.length - 1);
    if (lastChar == " " || lastChar == "\n" || lastChar == "\r" || lastChar == "\t"){
      str = str.substr(0, str.length - 1);
      continue;
    }
    break;
  }
  while (true){
    var firstChar = str.charAt(0);
    if (firstChar == " " || firstChar == "\n" || firstChar == "\r" || firstChar == "\t"){
      str = str.substring(1);
      continue;
    }
    break;
  }
  var pairs = str.split("&");
  var paramsList = new containerObject();
  for(var i = 0, c = pairs.length ; i<c ; i++){
    var param = pairs[i].split("=");
    if (param.length == 2){
      paramsList.set("$" + param[0], param[1]);

    }
  }
  this.gid = this["*Z*p"] = paramsList.get("$gid");
  this.gkey = this["5N2p"] = paramsList.get("$key");
  this.families = this["9t}[v"] = paramsList.get("$families");
  if (this.gid == null || this.gkey == null){
    this.loadVars(paramsList.get("$url"));
    return;
  }
  this.prepareGame();
};

trace('after parseDataString')