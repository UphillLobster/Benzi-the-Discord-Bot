//grabs rss info from websites and outputs it
//note that specialized functions for rss should also be added here i.e. humble bundle looks for the keyword free
const myfs = require("./botfilesystem.js");
const http = require("http");
const parser = require('fast-xml-parser');
const he = require('he');
const request = require("request-promise-native");
const moment = require("moment");

//humble bundle rss page info
const hbwebsite = 'http://blog.humblebundle.com/rss';

//gets a webpage's contents
exports.getWebpageContents = async function(uri){
  var page = await request(uri);

  return page;
}


const dif = 48;
//gets all humble bundle deals in last dif hours (that's usually how long free games last)
exports.getHumbleBundleRss = async function(){
  //parse its xml
  var humblebundlerss = parser.parse(await exports.getWebpageContents(hbwebsite));

  var items = humblebundlerss.rss.channel.item;

  var returnItems = [];

  //get now
  var cutoff = moment().subtract(dif,'hours');

  for(var item in items){
    //calculate if post was in last 48 hours
    var timestring = items[item].pubDate;

    //parse time
    var date = moment(timestring, 'dddd, DD MMM YYYY HH:mm:ss Z','en');

    //calculate if it's within dif hours
    if(date.isAfter(cutoff))
      returnItems.push(items[item]);
  }
  return returnItems;
}

//return any free game deals
exports.getFreeHumbleBundleGame = async function(){
  var freeGames = [];
  var items = await exports.getHumbleBundleRss();

  for(var item in items){
    if(items[item].category.includes("humble free game")){
      freeGames.push(items[item]);
    }
  }

  return freeGames;
}
