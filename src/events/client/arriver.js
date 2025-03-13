const {client} = require("../../index.js");
const {Events} = require("discord.js");
const msg = require("../../data/pre_load/accueil.js");
const {roles} = require("../../api/permanent");

client.on(Events.GuildMemberAdd, async (member) => {
    member.roles.add(roles.sympathisant);
    const channel = await member.createDM(true).catch(() => null);
    if (!channel) return;
    await channel.send(await msg.send().catch(() => null)).catch(() => null);
});