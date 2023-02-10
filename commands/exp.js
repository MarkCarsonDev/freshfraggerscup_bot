module.exports.run = (client, message, args, config) => {
    const Discord = require("discord.js")
    const steam = require('steamidconvert')(process.env.STEAM_TOKEN);
    const SteamID = require('steamid');
    const fs = require('fs')
    const request = require('request');
    const jp = require('jsonpath');

    var totalDpm = 0;
    var totalHeals = 0;
    var totalUbers = 0;
    var totalDrops = 0;
    var totalKills = 0;
    var totalDeaths = 0;
    var totalAssists = 0;
    var totalAirshots = 0;
    var healspread = 0;

    var dpmWorth = 0.6;
    var healsWorth = 0.05;
    var ubersWorth = 10;
    var dropsWorth = -25;
    var killsWorth = 8;
    var deathsWorth = -8;
    var assistsWorth = 3;
    var airshotsWorth = 6;
    var hoursWorth = 0.25;
    var altThreshold = 0.30;

    var score = 0;
    var finalScore = 0;
    var alt;
    var altProminence;
    var allFriends;
    var subjectFriends;

    function getSteamIDs(callback) {
        if (args[0] == "") {
            message.channel.send(`Error: You need to enter a link to the Steam profile after ffcexp (e.g. ffcexp https://steamcommunity.com/id/ElkYT)`)
        } else {
            if (args[0].toLowerCase().indexOf("steamcommunity.com/id".toLowerCase()) != -1) {
                if (args[0].slice(-1) == "/") {
                    customid = args[0].slice((args[0].indexOf("d")) + 2, args[0].lastIndexOf(args[0].slice(-1)))
                } else {
                    customid = `${args[0].slice((args[0].indexOf("d")) + 2, args[0].lastIndexOf(args[0].slice(-1)))}${args[0].slice(-1)}`
                }
                steam.convertVanity(customid, function (err, res) {
                    if (err) {
                        message.channel.send(`Error: Couldn't grab SID64 from Steam profile (Contact Elk)`);
                        console.log(err)
                    } else {
                        steamid64 = res
                        sid64 = steamid64
                        sid3 = (new SteamID(sid64)).steam3();
                        callback(sid64, sid3)
                    }
                })
            } else if (args[0].toLowerCase().indexOf("steamcommunity.com/profiles".toLowerCase()) != -1) {
                if (args[0].slice(-1) == "/") {
                    steamid64 = args[0].slice((args[0].indexOf("l")) + 4, args[0].lastIndexOf(args[0].slice(-1)))
                    sid64 = steamid64
                    sid3 = (new SteamID(sid64)).steam3();
                    callback(sid64, sid3)
                } else {
                    steamid64 = `${args[0].slice((args[0].indexOf("l")) + 4, args[0].lastIndexOf(args[0].slice(-1)))}${args[0].slice(-1)}`
                    sid64 = steamid64
                    sid3 = (new SteamID(sid64)).steam3();
                    callback(sid64, sid3)
                }
            } else if (args[0].length == 17 && /^\d+$/.test(args[0])) {
                message.channel.send(`Read '**${args[0]}**' as SteamID64...`)
                steamid64 = args[0]
                sid64 = steamid64
                sid3 = (new SteamID(sid64)).steam3();
                callback(sid64, sid3)
            } else {
                message.channel.send(`Read '**${args[0]}**' as Vanity URL...`)
                customid = args[0]
                steam.convertVanity(customid, function (err, res) {
                    if (err) {
                        message.channel.send(`Error: Couldn't find Steam Profile. Check your command.`);
                        console.log(err)
                    } else {
                        steamid64 = res
                        sid64 = steamid64
                        sid3 = (new SteamID(sid64)).steam3();
                        callback(sid64, sid3)
                    }
                })
            }
        }
    }

    function combineIntoScore(callback2) {
        totalDpm = (Math.round(totalDpm * 10) / 10)
        totalHeals = (Math.round(totalHeals * 10) / 10)
        totalUbers = (Math.round(totalUbers * 10) / 10)
        totalDrops = (Math.round(totalDrops * 10) / 10)
        totalKills = (Math.round(totalKills * 100) / 100)
        totalDeaths = (Math.round(totalDeaths * 100) / 100)
        totalAssists = (Math.round(totalAssists * 100) / 100)
        totalAirshots = (Math.round(totalAirshots * 10) / 10)
        console.log(totalAssists)
        var score = (Math.round((totalDpm * dpmWorth) + (totalUbers * ubersWorth) + (totalHeals * healsWorth) + (totalDrops * dropsWorth) + (totalKills * killsWorth) + (totalDeaths * deathsWorth) + (totalAssists * assistsWorth) + (totalAirshots * airshotsWorth)) / logIds.length)
        callback2(score)
        request(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${process.env.STEAM_TOKEN}&steamid=${sid64}&relationship=friend`, function (error, response, body) {
            body = JSON.parse(body)
            if (body.friendslist) {
                var subjectFriends = (jp.query(body.friendslist.friends, `$..*.steamid`))
                var i2 = subjectFriends.length
                var k2 = 0
                if (i2 > 0) {
                    console.log(`This user has ${i2} friend(s).`)
                    do {
                        i2--;
                        request(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${process.env.STEAM_TOKEN}&steamid=${subjectFriends[i2]}&relationship=friend`, function (error, response, body2) {
                            body2 = JSON.parse(body2)
                            if (body2.friendslist) {
                                var subFriend = {};
                                subFriend[subjectFriends[i2]] = (jp.query(body2.friendslist.friends, `$..*.steamid`))
                                if (!allFriends) {
                                    allFriends = subFriend[subjectFriends[i2]]
                                } else {
                                    allFriends = allFriends + subFriend[subjectFriends[i2]]
                                }
                            }
                            k2++
                            if (k2 == subjectFriends.length) {
                                array = allFriends.split(",")

                                var index = array.indexOf(sid64);
                                do {
                                    array.splice(index, 1);
                                    var index = array.indexOf(sid64);
                                } while (index != -1)

                                console.log(array.indexOf(sid64))
                                if (array.length == 0)
                                    return null;
                                var modeMap = {};
                                var maxEl = array[0], maxCount = 1;
                                for (var i = 0; i < array.length; i++) {
                                    var el = array[i];
                                    if (modeMap[el] == null)
                                        modeMap[el] = 1;
                                    else
                                        modeMap[el]++;
                                    if (modeMap[el] > maxCount) {
                                        maxEl = el;
                                        maxCount = modeMap[el];
                                    }
                                }
                                alt = maxEl
                                altProminence = maxCount
                                console.log(maxEl)
                                if (altProminence / subjectFriends.length >= altThreshold) {
                                    var embed = new Discord.RichEmbed()
                                        .setTitle(`**This account is under suspicion of being an alt!**`)
                                        .setColor("#F95454")
                                        .setDescription(`This doesn't really mean anything other than that the Staff will investigate further. There's no need to worry.`)
                                        .addField("Suspected Main",
                                            `**http://steamcommunity.com/profiles/${alt}**\n-`)

                                        .addField("Possibilty of Alt",
                                            `**${(Math.round((altProminence / subjectFriends.length) * 100))}%**`)

                                    message.channel.send(`This is not 100%, please research further into this player`, {
                                        embed
                                    });
                                }
                            }
                        });
                    }
                    while (i2 > 0)
                }
            };
        })
    }

    if (args[0]) {
        getSteamIDs(function (sid64, sid3) {

            console.log(`Got SID64 (${sid64}) and SID3 (${sid3})`)

            var steam = require('steam-community'),
                client = steam();

            request(`http://logs.tf/json_search?&player=${sid64}&limit=20`, function (error, response, body) {
                if (error) {
                    console.log(`Logs.TF Log-Fetching Error: ${error}`)
                }
                request(`http://api.etf2l.org/player/${sid64}.json`, function (etf2lerror, etf2lresponse, etf2lbody) {
                    if (etf2lerror) {
                        console.log(`ETF2L: ${etf2lerror}`)
                    }
                    if (etf2lbody[0] != "<") {
                        var etf2l = JSON.parse(etf2lbody)
                    } else {
                        var etf2l = "fuckIts3AMWhyDoIDoThisToMyself<3"
                    }
                    console.log('got etf2l parsed')
                    if (etf2l.player) {
                        var etf2lpage = `http://etf2l.org/forum/user/${etf2l.player.id}`
                    } else {
                        var etf2lpage = "This user does not have an ETF2L profile."
                    }
                    console.log(`Response request: ${response && response.statusCode}`)
                    var json = JSON.parse(body)
                    logIds = jp.query(json.logs, '$..id');
                    console.log(`Got LogIDs: ${logIds.join(', ')}`)
                    var i = logIds.length
                    var k = 0
                    if (i > 0) {
                        console.log(`This user has ${i} log(s).`)
                        do {
                            i--;
                            console.log(`Reading log #${Number([i]) + 1}`)
                            request(`http://logs.tf/json/${logIds[i]}`, function (error, response, body) {
                                var json2 = JSON.parse(body)
                                totalDpm += Math.round(Number(jp.query(json2.players[`${sid3}`], `$..dapm`)))
                                totalHeals += Math.round(Number(jp.query(json2.players[`${sid3}`], `$..heal`)))
                                totalUbers += Math.round(Number(jp.query(json2.players[`${sid3}`], `$..ubers`)))
                                totalDrops += Math.round(Number(jp.query(json2.players[`${sid3}`], `$..drops`)))
                                totalKills += Math.round(Number(json2.players[`${sid3}`].kills))
                                totalDeaths += Math.round(Number(json2.players[`${sid3}`].deaths))
                                totalAssists += Math.round(Number(json2.players[`${sid3}`].assists))
                                totalAirshots += Math.round(Number(json2.players[`${sid3}`].as))
                                k++
                                console.log(k + "/" + logIds.length)
                                if (k == logIds.length) {
                                    totalDpm = (Math.round(totalDpm * 10) / 10)
                                    totalHeals = (Math.round(totalHeals * 10) / 10)
                                    totalUbers = (Math.round(totalUbers * 10) / 10)
                                    totalDrops = (Math.round(totalDrops * 10) / 10)
                                    totalKills = (Math.round(totalKills * 100) / 100)
                                    totalDeaths = (Math.round(totalDeaths * 100) / 100)
                                    totalAssists = (Math.round(totalAssists * 100) / 100)
                                    totalAirshots = (Math.round(totalAirshots * 10) / 10)
                                    combineIntoScore(function (score) {
                                        finalScore = Math.round(score)
                                        console.log(finalScore)
                                                var embed = new Discord.RichEmbed()
                                                    .setTitle(`**FFC Score: ${finalScore}**`)
                                                    .setColor("#55A760")
                                                    .setDescription(`These are stats from this player's ${logIds.length} most recent [logs](http://logs.tf/profile/${sid64})\n`)
                                                    .addField("-\nAverage DPM",
                                                        `**${(totalDpm / logIds.length).toFixed(2)}**\nweighted at ${dpmWorth} each in FFC scoring system\n-`)

                                                    .addField("Average KDR (K/A/D)",
                                                        `**${((totalKills / logIds.length) / (totalDeaths / logIds.length)).toFixed(2)} (${(totalKills / logIds.length).toFixed(2)}/${((totalAssists / 2) / logIds.length).toFixed(2)}/${(totalDeaths / logIds.length).toFixed(2)})**\nweighted at ${killsWorth}/${assistsWorth}/${deathsWorth} each in FFC scoring system\n-`)

                                                    .addField("Average Healing",
                                                        `**${(totalHeals / logIds.length).toFixed(2)}**\nweighted at ${healsWorth} each in FFC scoring system\n-`)

                                                    .addField("Average Drops",
                                                        `**${(totalDrops / logIds.length).toFixed(2)}**\nweighted at ${dropsWorth} each in FFC scoring system\n-`)

                                                    .addField("Average Airshot Kills (Soldier and Demo)",
                                                        `**${(totalAirshots / logIds.length).toFixed(2)}**\nweighted at ${airshotsWorth} each in FFC scoring system\n-`)


                                                message.channel.send(`UGC: https://www.ugcleague.com/players_page.cfm?player_id=${sid64}\nETF2L: ${etf2lpage}\nESEA: https://play.esea.net/index.php?s=search&query=${(sid3.replace(/:/g, "%3A")).replace(/[\[\]']+/g,'')}\nOZFortress: https://warzone.ozfortress.com/users?q=${sid64}\nRGL: http://mm.rgl.gg/Public/PlayerProfile.aspx?p=${sid64}`,
                                                    {
                                                        embed
                                                    });
                                    });
                                }
                            })
                        } while (i > 0)
                    } else {
                        message.channel.send(`This user has no logs! Have them play more PUGs!`)
                        message.channel.send(`UGC: https://www.ugcleague.com/players_page.cfm?player_id=${sid64}\nETF2L: ${etf2lpage}\nESEA: https://play.esea.net/index.php?s=search&query=${(sid3.replace(/:/g, "%3A")).replace(/[\[\]']+/g,'')}\nOZFortress: https://warzone.ozfortress.com/users?q=${sid64}\nRGL: http://mm.rgl.gg/Public/PlayerProfile.aspx?p=${sid64}`)
                    }

                });
            })
        })
    } else {
        message.channel.send(`You need to put a link to your steam profile *after* ffcexp (e.g. \`ffcexp http://steamcommunity.com/id/elkyt\`)!`)
    }
}