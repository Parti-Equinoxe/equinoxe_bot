const { Events } = require("discord.js");
const { channelRoleCounter } = require("../../api/role");
const client = require("../../index").client;

client.safelyOn(Events.GuildMemberAdd, async (member) => {
    await channelRoleCounter();
});

client.safelyOn(Events.GuildMemberRemove, async (member) => {
    await channelRoleCounter();
});