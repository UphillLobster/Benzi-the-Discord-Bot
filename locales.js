const myfs = require('./botfilesystem.js');

function replacemacro(str, macros){
  var count = (str.match(/%~@/g) || []).length;
  var endstr = str;

  if(count%2 != 0){
      console.log(`not even amount, source: ${str} `);
      return str;
  }

  for(var macro in macros){
    var re = new RegExp(`%~@${macro}%~@`, "g");
    endstr = endstr.replace(re, macros[macro]);
  }

  return endstr;
}

exports.replacetext = function(str, language){
  locale = myfs.getLocale(language);

  if(locale){
    return replacemacro(str, locale);
  }else{
    return str;
  }
}
