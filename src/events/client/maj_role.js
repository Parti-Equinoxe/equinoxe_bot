const {Events} = require("discord.js");
const {channelRoleCounter, userARole, updateRoleMember} = require("../../api/role");
const {roles} = require("../../api/permanent");
const client = require("../../index").client;

client.on(Events.GuildMemberAdd, async (member) => {
    await updateRoleMember(member);
    await channelRoleCounter();
});

client.on(Events.GuildMemberRemove, async (member) => {
    await updateRoleMember(member);
    await channelRoleCounter();
});