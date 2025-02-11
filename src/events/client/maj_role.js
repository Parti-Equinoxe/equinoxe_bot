const {Events} = require("discord.js");
const {channelRoleCounter, updateRoleMember} = require("../../api/role");
const client = require("../../index").client;

client.on(Events.GuildMemberUpdate, async (memberOld, memberNew) => {
    await updateRoleMember(memberNew);
    await channelRoleCounter();
});