var Discord = require("discord.js")
const config = require("./config.json");
const fs = require("fs")
const client = new Discord.Client();
const Enmap = require("enmap");
const steam = require('steamidconvert')(process.env.STEAM_TOKEN);
const SteamID = require('steamid');
const request = require('request');
const jp = require("jsonpath");
//bruh

var rolemsg;
var guildUser;

client.commands = new Enmap();
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
  });
});

client.on("ready", () => {
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + ' ' + time;
  console.log("Ready to frag!");
  client.user.setPresence({ game: { name: 'the screams of the damned', type: 2 } });
  client.users.get("181543685744361482").send("I have been restarted at " + dateTime)

  try {
    client.guilds.map((guild) => {
      guild.channels.find("name", "regional-roles").fetchMessage('581250083782262832').then((message) => {

        var rolemsg = message;

        rolemsg.react("🇺🇸")
        rolemsg.react("🇪🇺")
        rolemsg.react("🇦🇺")
      });
    });
  } catch (err) {
    console.log(err)
  }

})

client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.channel.id == "584196106137763872") {
    if (message.content.split(/ +/g)[0].indexOf("steamcommunity.com/") != -1) {
      var steamLink = message.content.split(/ +/g)[0]
      console.log(message.content.split(/ +/g)[0])
      message.author.send("Request received! You will receive a message on whether or not you have been accepted into the tournament. \n\nIf you have any questions, you can send them in <#576533066131046406>. We hope to see you accepted into the tournament!")
      message.channel.guild.channels.find("name", "accept-deny").send(`<@${message.author.id}> requests with Steam ${message.content.split(/ +/g)[0]}\n\n`)
      message.react("👀")


      getSteamIDs(steamLink, message, function (sid64, sid3) {
        fs.readFile('players.json', 'utf8', function readFileCallback(err, data) {
          if (err) {
            console.log(err);
          } else {
            message.channel.guild.channels.find("name", "accept-deny").send(`\`\`\`
            "${message.author.id}": {
              "status": "👀",
              "sid64": "${sid64}"
        },\`\`\``)
            obj = JSON.parse(data);
            console.log(`Query if player already signed up: ${(jp.query(obj.players, `$..${message.author.id}`)).length}`)
            if ((jp.query(obj.players, `$..${message.author.id}`)).length !== 0) {
              obj.players[message.author.id] = {
                status: "👀",
                sid64: sid64
              }
            } else {
              obj.players[message.author.id] = {
                  status: "👀",
                  sid64: sid64
                }
              
            }
            console.log(obj)
            json = JSON.stringify(obj);
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            fs.writeFile('players.json', json, 'utf8', function () {
              message.channel.guild.channels.find("name", "players-json-logs").send(dateTime, { files: ["players.json"] })
          })

          }
        });
      });


    } else {
      message.delete()
      message.author.send("Your request has to be a link to your Steam profile. Because it was not, it has been deleted. You can repost it at any time.")
    }
  }
  if (message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command);
  if (!cmd) return;
  cmd.run(client, message, args);
})

client.on('messageReactionAdd', (reaction, user) => {
  reaction.message.guild.fetchMember(user).then((guildUser => {
    if (user.bot) {
      return;
    }
    if (reaction.emoji.name === "🇺🇸") {
      guildUser.addRole(reaction.message.guild.roles.find('name', 'NA'))
      guildUser.removeRole(reaction.message.guild.roles.find('name', 'EU'))
      guildUser.removeRole(reaction.message.guild.roles.find('name', 'AU'))
    }
    if (reaction.emoji.name === "🇪🇺") {
      guildUser.addRole(reaction.message.guild.roles.find('name', 'EU'))
      guildUser.removeRole(reaction.message.guild.roles.find('name', 'NA'))
      guildUser.removeRole(reaction.message.guild.roles.find('name', 'AU'))
    }
    if (reaction.emoji.name === "🇦🇺") {
      guildUser.addRole(reaction.message.guild.roles.find('name', 'AU'))
      guildUser.removeRole(reaction.message.guild.roles.find('name', 'NA'))
      guildUser.removeRole(reaction.message.guild.roles.find('name', 'EU'))
    }
  })
  )
});

client.on('messageReactionRemove', (reaction, user) => {
  reaction.message.guild.fetchMember(user).then((guildUser => {
    if (user.bot) {
      return;
    }
    if (reaction.emoji.name === "🇺🇸") {
      guildUser.removeRole(reaction.message.guild.roles.find('name', 'NA'))
    }
    if (reaction.emoji.name === "🇪🇺") {
      guildUser.removeRole(reaction.message.guild.roles.find('name', 'EU'))
    }
    if (reaction.emoji.name === "🇦🇺") {
      guildUser.removeRole(reaction.message.guild.roles.find('name', 'AU'))
    }
  })
  )
});

function getSteamIDs(steamLink, message, callback) {
  if (steamLink.toLowerCase().indexOf("steamcommunity.com/id".toLowerCase()) != -1) {
    if (steamLink.slice(-1) == "/") {
      customid = steamLink.slice((steamLink.indexOf("d")) + 2, steamLink.lastIndexOf(steamLink.slice(-1)))
    } else {
      customid = `${steamLink.slice((steamLink.indexOf("d")) + 2, steamLink.lastIndexOf(steamLink.slice(-1)))}${steamLink.slice(-1)}`
    }
    steam.convertVanity(customid, function (err, res) {
      if (err) {
        message.author.send("Your request has to be a link to your Steam profile. It seems that it wasn't quite correct and so it has been deleted. You can repost it at any time. Try copy-pasting it from your profile. Contact an Admin if this was a correct link. ")
        console.log(err)
      } else {
        steamid64 = res
        sid64 = steamid64
        sid3 = (new SteamID(sid64)).steam3();
        callback(sid64, sid3)
      }
    })
  } else if (steamLink.toLowerCase().indexOf("steamcommunity.com/profiles".toLowerCase()) != -1) {
    if (steamLink.slice(-1) == "/") {
      steamid64 = steamLink.slice((steamLink.indexOf("l")) + 4, steamLink.lastIndexOf(steamLink.slice(-1)))
      sid64 = steamid64
      sid3 = (new SteamID(sid64)).steam3();
      callback(sid64, sid3)
    } else {
      steamid64 = `${steamLink.slice((steamLink.indexOf("l")) + 4, steamLink.lastIndexOf(steamLink.slice(-1)))}${steamLink.slice(-1)}`
      sid64 = steamid64
      sid3 = (new SteamID(sid64)).steam3();
      callback(sid64, sid3)
    }
  } else {
    message.author.send("Your request has to be a link to your Steam profile. It seems that it was incorrect and so it has been deleted. You can repost it at any time. Try copy-pasting it from your profile.")
  }
}

client.login(process.env.BOT_TOKEN);