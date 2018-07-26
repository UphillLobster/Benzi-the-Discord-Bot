const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Feature not currently available');
  }
});

client.login('NDYzMDIwMDM1MzI2MzQ1MjE2.Djum8g.uMMxdFKPZBw0TicZtalXTJ5rBX8');