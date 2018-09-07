//format for exports is exports.functionname = function() { // some function }
const fs = require('fs');
const boterror = 'Error-Bbot : #';

/* function that checks for the existance of several crucial files and
directories for Benzi Bot to function properly */
exports.check = function(){
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
      //finds an error that does not relate to the file
      //prints the error number and details
      console.log(boterror + err.errno);
      console.error(err);
    }
  }
  //checks to make sure the serverData directory exists
  try {
    const serverfolder = fs.readdirSync(exports.getConfig().serverconfigslocation + '/');
  } catch (err) {
    if (err.errno == -4058) {
      //finds that the directory is non-existant
      //creates the directory
      fs.mkdirSync(exports.getConfig().serverconfigslocation + '/');
      //prints the process completion
      console.error('Created the server data directory');
    } else {
      //finds an error that does not relate to the directory
      //prints the error number and details
      console.log(boterror + err.errno);
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

function createServerConfig(serverid) {
  //object that formats the json file
  var serverconfigbase = {
    //Name of the server (FOR DIFFERENTIATION)
    name : 'insert name here',
    //Server Icon Link (STORED FOR IMAGE MANIPULATION)
    iconurl : 'insert link here',
    //Description of the Server (SET BY THE OWNER)
    desc : 'insert description here',
    //The preffered language of the user
    locale : 'English',
    //Command Prefix
    prefix : '=',
  }
  //creates a new serverData folder
  fs.writeFileSync(exports.getConfig().serverconfigslocation + '/' + serverid  + '.json', JSON.stringify(serverconfigbase));
  //prints  the process completion
  console.log('Created a Server Config File for server #' + serverid);
}

exports.getServerConfig = function(serverid){
  var serverconfig = null;

  try {
    serverconfig = fs.readFileSync(exports.getConfig().serverconfigslocation + '/' + serverid + '.json');
  } catch (err) {
    if (err.errno == -4058) {
      //finds that the file is nonexistant
      //calls the createServerConfig function to correct the error
      createServerConfig(serverid);
      serverconfig = fs.readFileSync(exports.getConfig().serverconfigslocation + '/' + serverid + '.json');
    } else {
      //finds an error that does not relate to the file
      //prints the error number and details
      console.log(boterror + err.errno);
      console.error(err);
      return null;
    }
  }
  //returns the file data if it exists already
  return JSON.parse(serverconfig);

}

exports.setServerConfig = function(serverid, obj) {
  //Edits the serverConfig
  fs.writeFileSync(exports.getConfig().serverconfigslocation+'/' + serverid+'.json', JSON.stringify(obj));
  //prints the process completion
  console.log('Modified the Server Config file for server #' + serverid);
}

exports.getLocale = function(language){
  var locale = null;

  try {
    locale= fs.readFileSync(exports.getConfig().localeslocation + '/' + language + '.json');
  } catch (err) {
    //failed
    return null;
  }
  //returns the file data if it exists already
  return JSON.parse(locale);
}
