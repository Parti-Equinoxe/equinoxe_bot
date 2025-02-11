const client = require("../../index").client;
const {blue} = require("cli-color");
const {ActivityType, Status, Events} = require("discord.js");
const {channelRoleCounter, verifRoles} = require("../../api/role");
const {getGuild} = require("../../api/utils");

client.once(Events.ClientReady, async () => {
    client.user.setPresence({
        activities: [{name: "le serveur", type: ActivityType.Watching}],
        status: Status.Connecting,
    });
    await client.application.commands.set(client.commands.map((cmd) => cmd));
    console.log(blue.bold.underline(`${client.user.tag} est connecté à discord !`));

    await verifRoles((await getGuild()).members.cache.map(m => m));
    await channelRoleCounter();
});