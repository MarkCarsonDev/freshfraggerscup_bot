module.exports.run = (bot, message, args, config) => {
    const Discord = require("discord.js")
    const steam = require('steamidconvert')(process.env.STEAM_TOKEN);
    const SteamID = require('steamid');
    const fs = require('fs')
    const request = require('request');
    const jp = require('jsonpath');

    if (message.guild.member(message.member.id).roles.has(message.guild.roles.find('name', 'Administrator').id)) {
        var steamLink = args[1]
        getSteamIDs(steamLink, message, function (sid64, sid3) {
            if (args[0] && message.mentions.members.first()) {
                if (args[2]) {
                    var status = args[2];
                } else {
                    var status = "👀";
                }
                var extMemID = message.mentions.members.first().id
                fs.readFile('players.json', 'utf8', function readFileCallback(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        obj = JSON.parse(data);
                        console.log(`Query if player already signed up: ${(jp.query(obj.players, `$..${extMemID}`)).length}`)
                        if ((jp.query(obj.players, `$..${extMemID}`)).length !== 0) {
                            obj.players[extMemID] = {
                                status: status,
                                sid64: sid64
                            }
                        } else {
                            obj.players[extMemID] = {
                                    status: status,
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
                        if (status == "✅") {
                            message.guild.members.get(extMemID).send("You have been accepted into the Fresh Fraggers Cup! You are now allowed to create a team. Once you have all the players you want (from your regional looking-for channels or elsewhere), you can follow the instructions in <#584206605139050501> to create your team.")
                            message.guild.members.get(extMemID).addRole(message.guild.roles.find('name', 'Players'))
                            message.react("✅")
                        } else if (status == "❌") {
                            message.guild.members.get(extMemID).send("We're sorry to inform you that you have been denied entry into the Fresh Fraggers Cup. This decision may be overturned by an Admin, in which case you will receive an acceptance message. For more information on this denial, please ask in our <#576533066131046406> channel or message an Admin.")
                            if (message.guild.members.get(extMemID).roles.has(message.guild.roles.find('name', 'Players'))) {
                                message.guild.members.get(extMemID).removeRole(message.guild.roles.find('name', 'Players'))
                            }
                            message.react("❌")
                        } else {
                            message.channel.guild.channels.find("name", "accept-deny").send(`<@${message.author.id}> requests with Steam ${message.content.split(/ +/g)[0]}\n\n`)
                            message.react("👀")
                        }


                    }
                });
            } else {
                message.channel.send(`Error: You need to mention the player's Discord in this space (e.g. ${config.prefix} forcestatus ${message.author} <steam profile link> [✅ || ❌])`)
            }
        });

    } else {
        message.channel.send("You must be an Admin to do this!")
    }

    function getSteamIDs(steamLink, message, callback) {
        if (steamLink.toLowerCase().indexOf("steamcommunity.com/id".toLowerCase()) != -1) {
            if (steamLink.slice(-1) == "/") {
                customid = steamLink.slice((steamLink.indexOf("d")) + 2, steamLink.lastIndexOf(steamLink.slice(-1)))
            } else {
                customid = `${steamLink.slice((steamLink.indexOf("d")) + 2, steamLink.lastIndexOf(steamLink.slice(-1)))}${steamLink.slice(-1)}`
            }
            steam.convertVanity(customid, function (err, res) {
                if (err) {
                    message.author.send("Your request has to be a link to the Steam profile. It seems that it wasn't quite correct. You can repost it at any time. Try copy-pasting it from the #steam channel. Contact Elk if this is correct.")
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
            message.author.send("Your request has to be a link to the Steam profile. It seems that it was incorrect. You can repost it at any time. Try copy-pasting it from #steam.")
        }
    }

};