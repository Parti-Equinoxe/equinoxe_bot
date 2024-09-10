const {getChannel} = require("../../api/utils.js");
const {salons} = require("../../api/permanent.js");
const {Events} = require("discord.js");
const client = require("../../index").client;

client.on(Events.GuildMemberAdd, async (member) => {
    await (await getChannel(salons.compteur)).edit({
        name: `🌗│${member.guild.memberCount} membres`
    });
});