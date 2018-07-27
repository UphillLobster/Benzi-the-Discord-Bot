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

CLIENT.on('ready', () => {
  console.log(`Logged in as ${CLIENT.user.tag}!`);
});

CLIENT.on('message', async msg => {
  if (!msg.content.startsWith(PREFIX))
    return;

  const msgargs = makeArgs(msg.content);

  if(msgargs[0] === PREFIX + 'ping')
    await msg.channel.send(`Pong! Latency is ${CLIENT.ping}ms.`);
});

CLIENT.login(myfs.getToken());
