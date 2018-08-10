const Discord = require('discord.js');
const myfs = require("./botfilesystem.js");
const loc = require("./locales.js");
const rss = require("./rssgrab.js");
const CLIENT = new Discord.Client();

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

//function that takes a string an server config to make macro string
function fixString(str, id){
  return loc.replacetext(str, myfs.getServerConfig(id).locale);
}

CLIENT.on('ready', () => {
  console.log(`Logged in as ${CLIENT.user.tag}!`);
  CLIENT.user.setActivity(myfs.getConfig().botstatus, { type: 'WATCHING' });
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
  if(msgargs[0] === PREFIX + fixString(config.commandlist.FUNC_PING.name, msg.guild.id))
    await msg.channel.send(`Pong! Latency is ${CLIENT.ping}ms.`);

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
