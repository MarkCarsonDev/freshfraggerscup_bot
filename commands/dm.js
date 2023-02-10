module.exports.run = (bot, message, args, config) => {
    if(message.guild.member(message.member.id).hasPermission("ADMINISTRATOR") && message.mentions.members && args.length > 1) {
        args.shift();
        var m = args.join(" ");
        var c = message.mentions.members.first()
        c.send(m);
        message.react("✅")
    }
    else {
        message.delete()
    }
};