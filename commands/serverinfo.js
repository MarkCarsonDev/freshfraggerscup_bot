module.exports.run = (client, message, args, config, pugs, icons, Discord) => {
    const steam = require('steamidconvert')(config.steamapi);
    const SteamID = require('steamid');
    const request = require('request');
    const iplocation = require("iplocation").default;
    const geoip = require('geoip-lite');

    function getSteamIDs(callback) {
        if (args[0] == "") {
            message.channel.send(`Error: You need to enter a link to your Steam profile after ${config.prefix}getscore (e.g. ${config.prefix}getscore https://steamcommunity.com/id/ElkYT)`)
        } else {
            if (args[0].toLowerCase().indexOf("steamcommunity.com/id".toLowerCase()) != -1) {
                if (args[0].slice(-1) == "/") {
                    customid = args[0].slice((args[0].indexOf("d")) + 2, args[0].lastIndexOf(args[0].slice(-1)))
                } else {
                    customid = `${args[0].slice((args[0].indexOf("d")) + 2, args[0].lastIndexOf(args[0].slice(-1)))}${args[0].slice(-1)}`
                }
                steam.convertVanity(customid, function (err, res) {
                    if (err) {
                        message.channel.send(`Error: Couldn't grab SID64 from Steam profile (Contact an Admin)`);
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


    if (args[0]) {
        getSteamIDs(function (sid64, sid3) {

            request(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=89E824D992EAA795D50D51D14DEE8904&steamids=${sid64}`, function (error, response, body) {
                body = JSON.parse(body)
                var ip = body.response.players[0].gameserverip
                var noPortIP = ip.substring(0, ip.indexOf(':'))
                console.log(ip + '\n\n' + noPortIP)
                var geo = geoip.lookup(noPortIP)
                console.log(`\n\n\n\n${geo}\n\n\n\n`)

                    var url = `https://extreme-ip-lookup.com/json/${noPortIP}`
                    request(url, function (error, response, body) {
                      console.log('error:', error); // Print the error if one occurred
                      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                      console.log('body:', body); // Print the HTML for the Google homepage.
                      var body = JSON.parse(body)
                      message.reply(`this user is playing on: __${ip}__, a server near **${response.city}, ${response.region}** *(${response.country})*`)
                    });

                        



            });
        });
    } else {
        message.channel.send(`You need to put a link to the targets steam profile *after* ${config.prefix}serverinfo (e.g. \`${config.prefix}serverinfo http://steamcommunity.com/id/elkyt\`)!`)
    }
}