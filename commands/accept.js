module.exports.run = (bot, message, args, config) => {
    const Discord = require("discord.js")
    const steam = require('steamidconvert')(process.env.STEAM_TOKEN);
    const SteamID = require('steamid');
    const fs = require('fs')
    const request = require('request');
    const jp = require('jsonpath');

    if (message.guild.member(message.member.id).roles.has(message.guild.roles.find('name', 'Administrator').id)) {

        if (args[0] && message.mentions.members.first()) {
            var extMemID = message.mentions.members.first().id
            fs.readFile('players.json', 'utf8', function readFileCallback(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    obj = JSON.parse(data);
                    console.log(`Query if player already signed up: ${(jp.query(obj.players, `$..${extMemID}`)).length}`)
                    if ((jp.query(obj.players, `$..${extMemID}`)).length !== 0) {
                        obj.players[extMemID] = {
                            status: "✅",
                            sid64: obj.players[extMemID].sid64
                        }
                    } else {
                        obj.players[extMemID] = {
                            status: "✅",
                            sid64: obj.players[extMemID].sid64
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
                    message.guild.members.get(extMemID).send("You have been accepted into the Fresh Fraggers Cup! You are now allowed to create a team. Once you have all the players you want (from your regional looking-for channels or elsewhere), you can follow the instructions in <#584206605139050501> to create your team.")
                    message.guild.members.get(extMemID).addRole(message.guild.roles.find('name', 'Players'))
                    message.react("✅")

                }
            });
        } else {
            message.channel.send(`Error: You need to mention the player's Discord in this space (e.g. ffc accept ${message.author})`)
        }

    } else {
        message.channel.send("You must be an Admin to do this!")
    }

};