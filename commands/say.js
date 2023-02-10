module.exports.run = (bot, message, args, config) => {
    if(message.guild.member(message.member.id).hasPermission("ADMINISTRATOR") && message.mentions.channels && args.length > 1) {
        args.shift();
        var m = args.join(" ");
        var c = message.mentions.channels.first();
        c.send(m);
    }
};