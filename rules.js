const Discord = require('discord.js');
const myfs = require("./botfilesystem.js");
const FORMAT = {
  rule : ' ',
  subrule : ' '
}
//Function that checks to see if both the rule description and rules array exist within the serverconfig
exports.checkRules = function(serverid) {
  //Variable Declarations
  var config = myfs.getServerConfig(serverid),
      checkDesc = false;
      checkRule = false;
  //Checks if the ruledesc variable exists
  if (config.ruledesc)
    //changes the checkDesc variable to true
    checkDesc = true;
  //Checks if the rules array exists
  if (config.rules)
    //changes the checkRule variable to true
    checkRule = true;
  //returns the combination of both the checkDesc and checkRule variables
  return checkDesc && checkRule;
}
//Function that checks to see if the subrule has been set
function checkSubrule(serverid, rulenum) {
  //Variable declaration
  var config = exports.getRules(serverid);
  //returns the boolean zen
  return config.rules[rulenum - 1].subrule != ' ';
}
//Function that checks to see if the rules array has been filled
exports.checkCompletion = function(serverid) {
  //Variable declarations
  var config = exports.getRules(serverid),
      complete = true;
  //For loop that loops through each rule and checks to see if the rule title is not blank
  for(var rule = 0; rule < config.rules.length && complete; rule++) {
    //Checks if the current rule title is blank
    if(config.rules[rule].rule === ' ') {
      //Changes the complete variable to false
      complete = false;
    }
  }
  //returns the complete variable
  return complete;
}

//Function that compiles a rule and returns the formatted version
exports.compileRule = function(serverid, rulenum) {
  //Variable declarations
  var config = myfs.getServerConfig(serverid),
      post = new Discord.RichEmbed('Rule');
  //Sets the author of the format to the server name
  post.setAuthor(config.name);
  //checks to see if the rule is within the bounds of the array
  if(config.rules.length >= rulenum) {
    //Checks if the subrule was left blank
    if (checkSubrule(serverid, rulenum)) {
      //formats the rich embed to include the set Subrule
      post.addField('Rule #' + rulenum + ' : \`' + config.rules[rulenum - 1].rule + '\`', '\`' + config.rules[rulenum - 1].subrule + '\`', true);
    } else {
      //formats the rich embed to exclude the set Subrule
      post.setFooter('Rule #' + rulenum +  ' : \`' + config.rules[rulenum - 1].rule + '\`');
    }
  } else {
    //formats the rich embed to return an error
    post.addField(':interrobang:', 'Rule ' + rulenum + ' doesn\'t exist', true);
  }
  return post;
}

exports.compileRules = function(serverid, user, failsafe) {
  //Variables Declarations
  var post = new Discord.RichEmbed('Ha'),
      config = myfs.getServerConfig(serverid);

  //If statement that determs whether the author is the server or the owner
  if(failsafe === true) {
    post.setAuthor(`${guild.name}`)
  } else {
    post.setAuthor(user);
  }
  //Sets the description of the rules post to the description stoered in the server config file
  if(config.ruledesc)
    post.setDescription(config.ruledesc);
//loops through each rule and adds it as a field to the post rich embed object
  for (var rule = 0; rule < config.rules.length; rule++) {
     //Checks if the subrule was left blank
    if (checkSubrule(serverid, rule + 1)) {
      //formats the rich embed to include the set Subrule
      post.addField('#' + (rule + 1) + config.rules[rule].rule, config.rules[rule].subrule, true);
    } else {
      //formats the rich embed to exclude the set Subrule
      post.addField('#' + (rule + 1) + config.rules[rule].rule, ' ', false);
    }
  }
  //returns the object
  return post;
}

//Function that gets the rules from the serverconfig
exports.getRules = function(serverid) {
  //Variable Declaration
  var config = myfs.getServerConfig(serverid);
  //Checks to see if the rules are already there
  if (exports.checkRules(serverid)) {
    //Returns the config
    return config;
  } else {
    //Prints the error to the console
    console.log('Rule Segment doesn\'t exist ');
    //returns null
    return null;
  }
}

//Function that puts a blank formatted version of the rules based on the serverid and max variable into the serverconfig
exports.setupRules = function(serverid, max) {
  //Variable Declarations
  var config = myfs.getServerConfig(serverid),
      rules = [FORMAT];
  //For loop that inserts the format into each element of the rules array
  for (var curRule = 1; curRule < max; curRule++) {
    //Appends the format to the end of the array
    rules.push(FORMAT);
    //Prints the current rule to the console for debugging purposes
    console.log(rules[curRule]);
  }
  //Adds the rules array to the serverconfig
  config.rules = rules;
  //Saves the serverconfig
  myfs.setServerConfig(serverid, config);
}

//Function used to store the messageid of the rules post that the bot needs to update
exports.storeMainRules = function(serverid, messageid, channelid) {
  //Config declaration
  var config = myfs.getServerConfig(serverid);
  //Stores the channel and messageids in objects inside the config variable
  config.ruleupdate = messageid;
  config.rulechannel = channelid;
  //Updates the serverconfig
  myfs.setServerConfig(serverid);
}

//Function that edits the message stored in the server config to an updated version of the rules
exports.updateRules = function(serverid, user, boolean) {
  var config = myfs.getServerConfig(serverid);
  //Error catching
  if (config.ruleupdate) {
    if(config.ruleupdate.channel === config.rulechannel)
    //Edits the message based on the message id stored in the server message to a more updated version of the rules
    config.ruleupdate.edit(compileRules(serverid, user, boolean));
  } else {
    console.log('ERROR B-bot : config.ruleupdate doesnt exist');
  }
}
//Function that sets the rule by the rulenumber
exports.setRule = function(serverid, rulenum, text) {
  //Declaration of the Config
  var config = myfs.getServerConfig(serverid),
      error = new Discord.RichEmbed('error');
  //Checks to see if it has been passed an invalid value
  if (config.rules.length < rulenum) {
    //Error statement
    error.addField(':interroban:', 'Out of Bounds : There are ' + config.rules.length + ' total rules', true);
    msg.channel.send(error);
  } else {
    //sets the rule to the text variable
    config.rules[rulenum - 1].rule = text;
    //Saves the update to the serverconfig
    myfs.setServerConfig(serverid, config);
  }
}
//Function that sets the subrule by the rulenumber
exports.setSubrule = function(serverid, rulenum, text) {
  var config = myfs.getServerConfig(serverid),
      error = new Discord.RichEmbed('error');
  if(config.rules.length < rulenum) {
    //Error statement
    error.addField(':interroban:', 'Out of Bounds : There are ' + config.rules.length + ' total rules', true);
    msg.channel.send(error);
  } else {
    config.rules[rulenum - 1].subrule = { text };
    myfs.setServerConfig(serverid, config);
  }
}
//Function that sets the ruledesc variable in the serverconfig
exports.setDesc = function(serverid, desc) {
  //Config
  var config = myfs.getServerConfig(serverid);
  //Updates ruledesc variable to the description of the rules
  config.ruledesc = desc;
  //Saves the changes to the server config
  myfs.setServerConfig(serverid, config);
}
//Function that adds a rule onto the end of the Rules array in the server config
exports.addRule = function(serverid) {
  //Config
  var config = exports.getRules(serverid);
  //pushes the format to a new element at the end of the array
  config.rules.push(FORMAT);
  //Saves the data to the serverconfig
  myfs.setServerConfig(config);
}

//Function that removes a number specific rule from thje array
exports.removeRule = function(serverid, rulenum) {
  var config = myfs.getServerConfig(serverid);
  //Pops the rule specified by the rulenum variable from the array in the serverconfig
  config.rules[rulenum - 1].pop;
  //Saves the data to the server config
  myfs.setServerConfig(config);
}
