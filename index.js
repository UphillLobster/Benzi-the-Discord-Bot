const Discord = require('discord.js');
const myfs = require("./botfilesystem.js");
const loc = require("./locales.js");
const rule = require("./rules.js");
const rss = require("./rssgrab.js");
const CLIENT = new Discord.Client();
const RICH = new Discord.RichEmbed('Standard')

//checks if setup
myfs.check();

function makeArgs(message) {
/*  var arr = message.split(' ');
  for (var word = 0; word <= arr.length - 1; word++) {
    console.log(arr[word]);
  } THIS IS FOR TESTING THE PARSERS FUNCTIONALITY*/
  return message.split(' ');
}
//function that returns the argument in the proper variable type
function convertArgs(arg) {
  if(isNaN(arg)) {
    //Finds that the argument is a string and spits it back out
    return arg;
  } else {
    //Finds that the argument is a number and returns it as a number
    return parseFloat(arg);
  }
}
//function that breaks apart complex arguments into seperated datatypes and returns an array of all the split up data
function convertComplexArgs(arg) {
  var comparator = new RegExp('([0-9]+|[^0-9]+)', 'g')
  var convert = arg.match(comparator);
  console.log(convert);
  if(convert === null) {
    console.log('Failed to parse complex argument');
    return convert;
  } else {
    return convert;
  }

}
//Function that combines the arguments after a certain number into one big string
function combineSpacedArgs(arr, argnum) {
  //Variable definition
  var combined = '';
  //For Loop that concatanates every argument after the command and rule number
  for (var word = argnum; word < arr.length; word++) {
    //stores the concatanated string the description variable
    combined += arr[word] + ' ';
  }
  //Return statement
  return combined;
}

//Function that takes in the sign, number, and another number and returns the mathematical function
function calc(roll, sign, number) {
  //Variable declaration
  var calc;
  //Checks to see which mathematical symbol was passed into the function
  if (sign === '+') {
    calc = roll + number;
  } else if (sign === '-') {
    calc = roll - number;
  } else if (sign === '*') {
    calc = roll * number;
  } else {
    calc = roll / number;
  }
  //Returns calc
  return calc;
}
//function that takes a string an server config to make macro string
function fixString(str, id){
  return loc.replacetext(str, myfs.getServerConfig(id).locale);
}

//function that takes a string an server config to make macro string
function fixString(str, id){
  return loc.replacetext(str, myfs.getServerConfig(id).locale);
}

CLIENT.on('ready', () => {
  console.log(`Logged in as ${CLIENT.user.tag}!`);
  CLIENT.user.setActivity(myfs.getConfig().botstatus, { type: 'WATCHING' });
  RICH.setColor('DARK_ORANGE');
//  rule.getRules(220, 'This is a basic rule format')
//  rule.setupRules(220, 5);
});

CLIENT.on('guildCreate', (guild) => {
  //create a config
  var serverdata = myfs.getServerConfig(guild.id);

  //modify the data
  serverdata.name = guild.name;
  serverdata.iconurl = guild.iconURL;

  myfs.setServerConfig(guild.id, serverdata);

});

CLIENT.on('message', async msg => {
  //deny bot messages
  if(msg.author.bot) return;

  if(!msg.guild){
    //somebody sent a DM to the bot
    console.log(`${msg.author.tag} attempted to DM the bot`);
    await msg.channel.send("Direct messaging isn't supported at the moment.");
    return;
  }

  const config = myfs.getConfig();
  const svConfig = myfs.getServerConfig(msg.guild.id);

  const PREFIX = svConfig.prefix;

  //message must have prefix
  if (!msg.content.startsWith(PREFIX))
    return;

  const msgargs = makeArgs(msg.content);

  //load command name from the locale file
  if(msgargs[0] === PREFIX + fixString(config.commandlist.FUNC_PING.name, msg.guild.id)) {
    //await msg.channel.send(`Pong! Latency is ${CLIENT.ping}ms.`);
    RICH.addField('Pong:ping_pong:', ` Latency is ${CLIENT.ping}ms.`, true);
    await msg.channel.send(RICH);
  }

  if(msgargs[0] === PREFIX + fixString(config.commandlist.FUNC_CREATERULES.name, msg.guild.id)) {
    //Variable Declaration
    var rejection = new Discord.RichEmbed('Error');
    //Checks if the msgargs array is greaterthan or equal to 3
    if(!(msgargs.length < 3) && !rule.checkRules(msg.guild.id)) {
        //sets up the rules array in the server config
        rule.setupRules(msg.guild.id, msgargs[1]);
        //sets the description for the rules
        rule.setDesc(msg.guild.id, combineSpacedArgs(msgargs, 2));
        //Formats the RICH EMBED
        rejection.addField(':white_check_mark:', 'Rules Successfully Created!\n\tNow you need to set your rules', true);
        //Sends the RICH EMBED
        msg.channel.send(rejection);
    } else {
      if(rule.checkRules(msg.guild.id)) {
        //Sets up the RICH EMBED
        rejection.addField(':interrobang:', 'Rules have already been created', true);
      } else {
        //Sets up the RICH EMBED
        rejection.addField(':interrobang:', 'Invalid number of Arguments', true);
      }
      //Sends the error to the channel
      msg.channel.send(rejection);
    }
    //Checks to see if the second argument is a number
    if(isNaN(msgargs[1])) {
      //Sets up the RICH EMBED
      rejection.setAuthor(CLIENT.username);
      rejection.addField(':interrobang: ', msgargs[1] + ' is not a valid number.', true);
      //Sends the error to the channel
      msg.channel.send(rejection);
    }
  }
  //Command that prints the given rule
  if(msgargs[0] === PREFIX + fixString(config.commandlist.FUNC_RULE.name, msg.guild.id)) {
    if(msgargs.length >= 2 && !(isNaN(msgargs[1])) && rule.checkCompletion(msg.guild.id)) {
      //Sends the compiled rule to the chat
      msg.channel.send(rule.compileRule(msg.guild.id, msgargs[1]))
    } else {
      //Variable declaration
      var error = new Discord.RichEmbed('error');
      //Checks to see which error it is
      if(!rule.checkCompletion(msg.guild.id)) {
        //Formats and returns the error
        error.addField(':interrobang:', 'The rules are not yet complete');
        msg.channel.send(error);
      } else {
        //Formats and returns the error
        error.addField(':interrobang:', msgargs[1] + ' is Not a valid number');
        msg.channel.send(error);
      }
    }
  }
  //Command that sets the given rule
  if(msgargs[0] === PREFIX + fixString(config.commandlist.FUNC_SETRULE.name, msg.guild.id)) {
    //Creates the RICH EMBED
    var error = new Discord.RichEmbed('error');
    if(msgargs.length >= 3 && !(isNaN(msgargs[1]))) {
      //sets the rule
      rule.setRule(msg.guild.id, msgargs[1], combineSpacedArgs(msgargs, 2));
      error.addField(':white_check_mark:', 'Rule successfully set\n\`' + combineSpacedArgs(msgargs, 2) + '\`');

    } else {
      //Formats the error
      error.addField(':interrobang:', msgargs[1] + 'is Not a valid number');
    }
    //Posts the RICH EMBED
    msg.channel.send(error);
  }
  //Command that sets the given subrule
  if(msgargs[0] === PREFIX + fixString(config.commandlist.FUNC_SETRULEDESC.name, msg.guild.id)) {
    //Creates the RICH EMBED
    var error = new Discord.RichEmbed('error');
    if(msgargs.length >= 3 && !(isNaN(msgargs[1]))) {
      //sets the rule
      rule.setSubrule(msg.guild.id, msgargs[1], combineSpacedArgs(msgargs, 2));
      error.addField(':white_check_mark:', 'Rule description successfully set\n\`' + combineSpacedArgs(msgargs, 2) + '\`');
    } else {
      //Formats the error
      error.addField(':interrobang:', msgargs[1] + 'is Not a valid number');
    }
    //Posts the RICH EMBED
    msg.channel.send(error);
  }
  //Command that posts the formatted rules
  if(msgargs[0] === PREFIX + fixString(config.commandlist.FUNC_POSTRULES.name, msg.guild.id)) {
    if(rule.checkCompletion(msg.guild.id)) {
      //Posts the compiled rules
      msg.channel.send(rule.compileRules(msg.guild.id), msg.author, msgargs[1]);
    } else {
      //Formats and returns the error
      error.addField(':interrobang:', 'The \`' + msg.guild.name + '\` rules are not complete');
      msg.channel.send(error);
    }
  }

  if(msgargs[0] === PREFIX + fixString(config.commandlist.FUNC_ROLL.name, msg.guild.id)) {
    var checkSign = false;

    //Checks to see if extra math is passed to the roll command
    if(msgargs.length > 2 && (msgargs[2] === '*' || msgargs[2] === '-' || msgargs[2] === '+' || msgargs[2] === '/')) {
      if(!(isNaN(msgargs[3]))) {

        //Converts the string to a number
        msgargs[3] = parseInt(msgargs[3]);
        console.log('triggered ' + (msgargs[3] + 1) )
        //Sets checkSign to true
        checkSign = true;
      } else {

        //Formats and returns the error
        var error = new Discord.RichEmbed('error');
        error.addField(':interrobang:', msgargs[3] + 'is Not a valid number');
        msg.channel.send(error);
      }
    }

    //Variable Declarations
    var dice = convertComplexArgs(msgargs[1]),
        roll = [],
        error = new Discord.RichEmbed('error'),
        format = '';

    //Converts the numbers on the dice
    parseInt(dice[0]);
    parseInt(dice[2]);

    //Checks to see if it was formatted correctly
    if (dice === null || dice[1] != 'd' || dice.length > 3) {
      //Sets up the RICH EMBED
      error.setAuthor(CLIENT.username);
      error.addField(':interrobang:', 'Invalid dice format\nExample: 1d20', true);

      //Sends the error message
      msg.channel.send(error);
    } else {

      //For loop that rolls the dice
      for (var current = 0; current <= dice[0]; current++) {
        roll.push(Math.floor((Math.random() * dice[2]) + 1));
      }
      //Checks to see if their was a mathematical sign as an argument
      if(checkSign) {

        //Formats the first roll of the RICHEMBED
        format += 'Roll #1 \n\tBefore:\`' + roll[0] + '\`\n\tAfter:\`' + calc(parseInt(roll[0]), msgargs[2], msgargs[3]) + '\`';

        //loops through each roll and adds the calculated variable
        for(var rolls = 1; rolls < roll.length - 1; rolls++) {

          //Formats the RICH EMBED and adds the calculated variable
          format += '\nRoll #' + (rolls + 1) + '\n\tBefore:\`' + parseInt(roll[rolls]) + '\`\n\tAfter:\`' + calc(parseInt(roll[rolls]), msgargs[2], msgargs[3]) + '\`';
        }

        //Adds the field to the rich embed
        error.addField(':game_die:', format, true);

        //Posts the RICHEMBED
        msg.channel.send(error);
      } else {

        //Formats the first ROLL for the RICHEMBED
        format += 'Roll #1 : \`' + parseInt(roll[0]) + '\`';

        //loops through each roll and adds the calculated variable
        for(var rolls = 1; rolls < roll.length - 1; rolls++) {

          //Formats the each roll after the first for the RICHEMBED
          format += '\nRoll #' + (rolls + 1) + ' : \`' + parseInt(roll[rolls]) + '\`';
        }

        //Adds the field to the rich embed
        error.addField(':game_die:', format, true);

        //Posts the RICHEMBED
        msg.channel.send(error);
      }
    }


  }
  
  if(msgargs[0] === PREFIX + fixString(config.commandlist.FUNC_HELP.name, msg.guild.id)){
    var commandlist = config.commandlist;
    if(msgargs.length > 1){
      //asked abouta  specific command
      //check if it exists
      var result = null;
      for(var command in commandlist){
        if(fixString(commandlist[command].name, msg.guild.id) === msgargs[1]){
          result = commandlist[command];
        }
      }

      //send result
      if(result === null){
        await msg.channel.send(`No such command exists.`);
      }else{
        await msg.channel.send(`Results sent to DM.`);
        var helpmsg = `${fixString(result.name, msg.guild.id)}: ${fixString(result.desc,msg.guild.id)}\nexample(s):\n`;
        for(var example in result.examples){
          helpmsg+=`${PREFIX}${fixString(result.name, msg.guild.id)} ${fixString(result.examples[example], msg.guild.id)}\n`;
        }
        await msg.author.send(helpmsg);
      }

    }else{
      //list all without descriptions
      await msg.channel.send(`Results sent to DM.`);
      var helpmsg = '';
      for(var command in commandlist){
        helpmsg+=`${fixString(commandlist[command].name, msg.guild.id)}\n`;
      }
      await msg.author.send(helpmsg);
    }
  }

  if(msgargs[0] === PREFIX + fixString(config.commandlist.FUNC_HUMBLEBUNDLE.name, msg.guild.id)){
    var deals = await rss.getHumbleBundleRss();

    //format messages
    var message = "Here are all the deals in the last 48 hours:\n";
    for(var deal in deals){
      var theDeal = deals[deal];

      message += theDeal.link+'\n';
    }

    msg.channel.send('Results sent to DM.');
    msg.author.send(message);
  }
});

CLIENT.login(myfs.getToken());
