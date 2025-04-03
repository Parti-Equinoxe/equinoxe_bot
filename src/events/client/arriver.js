const { client } = require("../../index.js");
const { Events } = require("discord.js");
const { getMessage } = require("../../api/prefabMessage.js");

client.safelyOn(Events.GuildMemberAdd, async (member) => {
    const configSympathisantRole = {};
    if (client.configHandler.tryGet("sympathisantRole", configSympathisantRole)) {
        await member.roles.add(configSympathisantRole.value)
    }

    const configMessage = {};
    if (!client.configHandler.tryGet("wellcomingMessage", configMessage))
        return;

    const channel = await member.createDM(true).catch(() => null);
    if (!channel) return;
    await channel.send(getMessage(configMessage.value)).catch(() => null);
});