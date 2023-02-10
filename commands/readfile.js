const Discord = require("discord.js")
const fs = require("fs")
const client = new Discord.Client();
const Enmap = require("enmap");

module.exports.run = (client, message, args) => {
    if (message.guild.member(message.member.id).hasPermission("ADMINISTRATOR")) {
        fs.readFile(args[0], 'utf8', function (err, content) {
            if (err) {
                return message.channel.send(err);
                return console.log(err);
            }
            if (content.length < 1995) {
                message.channel.send(`${args[0]}\n\`\`\`${args[0].split('.')[1]}\n${content}\`\`\``);
            } else {
                message.channel.send(`Sorry about that, but the length of this file exceeds Discord's capacity of 2000 (${content.length}/2000)`)
            }
        });
    }
}