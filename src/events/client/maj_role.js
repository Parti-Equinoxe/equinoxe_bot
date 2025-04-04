const {Events} = require("discord.js");
const {channelRoleCounter, updateRoleMember, removeRoleMember} = require("../../api/role");
const client = require("../../index").client;

client.on(Events.GuildMemberUpdate, async (memberOld, memberNew) => {
    await updateRoleMember(memberNew);
    await removeRoleMember(memberNew)
    await channelRoleCounter();
});