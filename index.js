const Discord = require('discord.js');
const CLIENT = new Discord.Client();
const PREFIX = '=';

CLIENT.on('ready', () => {
  console.log(`Logged in as ${CLIENT.user.tag}!`);
});

CLIENT.on('message', async msg => {
  if (!msg.content.startsWith(PREFIX))
    return;
  if(msg.content.startsWith(PREFIX + 'ping'))
    msg.channel.send(`Latency is ${CLIENT.ping}ms`);
});

function simpleParse(message) {
/*  var arr = message.split(' ');
  for (var word = 0; word <= arr.length - 1; word++) {
    console.log(arr[word]);
  } THIS IS FOR TESTING THE PARSERS FUNCTIONALITY*/
  return message.split(' ');
}


CLIENT.login('NDYzMDIwMDM1MzI2MzQ1MjE2.Djum8g.uMMxdFKPZBw0TicZtalXTJ5rBX8');
