
//format for exports is exports.functionname = function() { // some function }
const fs = require('fs');
const boterror = 'Error-Bbot : #';

/* function that checks for the existance of several crucial files and
directories for Benzi Bot to function properly */
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
      //finds an error that does not relate to the file
      //prints the error number and details
      console.log(boterror + err.errno);
      console.error(err);
    }
  }
  //checks to make sure the serverData directory exists
  try {
    const serverfolder = fs.readdirSync('./Server Data/');
  } catch (err) {
    if (err.errno == -4058) {
      //finds that the directory is non-existant
      //creates the directory
      fs.mkdirSync('./Server Data/');
      //prints the process completion
      console.error('Created the missing server data directory');
      process.exit(2);
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
    server_name : 'insert name here',
    //Server Icon Link (STORED FOR IMAGE MANIPULATION)
    server_icon : 'insert link here',
    //Description of the Server (SET BY THE OWNER)
    server_desc : 'insert description here',
    //The preffered language of the user
    locale : 'insert language',
    //Command Prefix
    prefix : '=',
  }
  //creates a new serverData folder
  fs.writeFileSync('./Server Data/' + serverid, JSON.stringify(serverconfigbase));
  //prints  the process completion
  console.log('Created a Server Config File for server #' + serverid);
}

exports.getServerConfig = function(serverid){
  try {
    var serverconfig = fs.readFileSync('./Server Data/' + serverid);
  } catch (err) {
    if (err.errno == -4058) {
      //finds that the file is nonexistant
      //calls the createServerConfig function to correct the error
      createServerConfig(serverid);
    } else {
      //finds an error that does not relate to the file
      //prints the error number and details
      console.log(boterror + err.errno);
      console.error(err);
      return null;
    }
  }
  //returns the file data if it exists already
  return JSON.parse(fs.readFileSync('./Server Data/' + serverid));

}

exports.editServerConfig = function(serverid, edit) {
  //Edits the serverConfig
  fs.writeFileSync('./Server Data/' + serverid, JSON.stringify(edit));
  //prints the process completion
  console.log('Modified the Server Config file for server #' + serverid);
}
