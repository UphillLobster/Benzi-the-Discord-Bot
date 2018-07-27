
//format for exports is exports.functionname = function() { // some function }
const fs = require('fs');

exports.check =  function(){
  //check if token.json exists
  try {
    const tokenfile = fs.readFileSync('./token.json');
  } catch (err) {
    //check error code
    if(err.errno === -4058){
      //file missing so create it then fail
      //object to make json
      var tokentempobj = {
        token : 'replaceme'
      }
      //make file
      fs.writeFileSync('./token.json', JSON.stringify(tokentempobj));

      console.error('Created the missing token file');
      process.exit(1);
    }else{
      console.error(err);
    }
  }


  //if it reaches here it's all good
  return true;
}

exports.getToken = function(){
  return JSON.parse(fs.readFileSync('./token.json')).token;
}

exports.getConfig = function(){
  return JSON.parse(fs.readFileSync('./config.json'))
}

exports.createServerConfig = function (serverid){
  //todo: create json file from server id
}

exports.getServerConfig = function(serverid){
  //todo: check if file exists and create it if not
  //todo: return server config object
}
