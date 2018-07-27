const Discord = require('discord.js');
const myfs = require("./botfilesystem.js");
const CLIENT = new Discord.Client();

//checks if setup
myfs.check();

const PREFIX = myfs.getConfig().prefix;

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

CLIENT.on('ready', () => {
  console.log(`Logged in as ${CLIENT.user.tag}!`);
  myfs.getServerConfig(220);
});

CLIENT.on('message', async msg => {
  //message must have prefix and sender not a bot
  if (!msg.content.startsWith(PREFIX) && !msg.author.bot)
    return;

  const msgargs = makeArgs(msg.content);

  if(msgargs[0] === PREFIX + 'ping')
    await msg.channel.send(`Pong! Latency is ${CLIENT.ping}ms.`);

  if(msgargs[0] === PREFIX + 'help'){
    var commandlist = myfs.getConfig().commandlist;
    if(msgargs.length > 1){
      //asked abouta  specific command
      //check if it exists
      var result = null;
      for(var command in commandlist){
        if(commandlist[command].name === msgargs[1]){
          result = commandlist[command];
        }
      }

      //send result
      if(result === null){
        await msg.channel.send(`No such command exists.`);
      }else{
        await msg.channel.send(`Results sent to DM.`);
        var helpmsg = `${result.name}: ${result.desc}\nexample(s):\n`;
        for(var example in result.examples){
          helpmsg+=`${PREFIX}${result.name} ${result.examples[example]}\n`;
        }
        await msg.author.send(helpmsg);
      }

    }else{
      //list all without descriptions
      await msg.channel.send(`Results sent to DM.`);
      var helpmsg = '';
      for(var command in commandlist){
        helpmsg+=`${commandlist[command].name}\n`;
      }
      await msg.author.send(helpmsg);
    }
  }
});

CLIENT.login(myfs.getToken());
