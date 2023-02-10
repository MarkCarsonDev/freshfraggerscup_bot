const Discord = require("discord.js")
const fs = require("fs")
const client = new Discord.Client();
const Enmap = require("enmap");

module.exports.run = (client, message, args) => {
    if (message.guild.member(message.member.id).hasPermission("ADMINISTRATOR")) {
        var ffc = message.channel.guild;

        ffc.createRole({
            name: `${args.join(" ")}`,
        }).then(newRole => {
            permissions = [
                {
                    id: ffc.defaultRole.id,
                    deny: 2146958839
                },
                {
                    id: newRole.id,
                    allow: 66571584
                }
            ]

            ffc.createChannel(`${args.join(" ")}`, {
                type: 'category',
                permissionOverwrites: permissions
            })
                .then(

                    ffc.createChannel("general", "text", permissions)
                        .then(channel => {
                            channel.setParent(ffc.channels.find('name', args.join(" ")));

                            ffc.createChannel("Voice", "voice", permissions)
                                .then(channel => {
                                    channel.setParent(ffc.channels.find('name', args.join(" ")));

                                    ffc.createChannel("important-stuff", "text", permissions)
                                        .then(channel => {
                                            channel.setParent(ffc.channels.find('name', args.join(" ")));
                                        })
                                })

                        })

                )

        }



        )



    }
}