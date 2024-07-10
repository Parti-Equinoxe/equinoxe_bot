const {getChannel} = require("../../api/utils.js");
const {salons} = require("../../api/permanent.js");
const client = require("../../index").client;

client.on("guildMemberAdd", async (member) => {
    await (await getChannel(salons.compteur)).edit({
        name: `🌗│${member.guild.memberCount} membres`
    });
});