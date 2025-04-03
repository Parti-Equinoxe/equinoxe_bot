const { client } = require("../../index.js");
const { Events } = require("discord.js");
const { getMessage } = require("../../api/prefabMessage.js");

client.safelyOn(Events.GuildMemberAdd, async (member) => {
    const config = {};
    if (!client.configHandler.tryGet("wellcomingMessage", config))
        return;
    const channel = await member.createDM(true).catch(() => null);
    if (!channel) return;
    await channel.send(getMessage(config.value)).catch(() => null);
});