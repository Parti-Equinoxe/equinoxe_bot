const {client} = require("../../index.js");
const {Events} = require("discord.js");
const msg = require("../../data/pre_load/arriver.js");

client.on(Events.GuildMemberAdd, async (member) => {
    const channel = await member.createDM(true).catch(() => null);
    if (!channel) return;
    await channel.send(await msg.send());
});