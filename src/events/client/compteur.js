const {Events} = require("discord.js");
const {channelRoleCounter} = require("../../api/role");
const client = require("../../index").client;

client.on(Events.GuildMemberAdd, async (member) => {
    await channelRoleCounter();
});

client.on(Events.GuildMemberRemove, async (member) => {
    await channelRoleCounter();
});