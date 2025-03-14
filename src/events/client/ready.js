const client = require("../../index").client;
const {blue, redBright} = require("cli-color");
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
    try {
        await verifRoles((await getGuild()).members.cache.map(m => m));
        await channelRoleCounter();
    } catch (e) {
        console.log(redBright.bold(">> Erreur après le chargement du bot (event : ready) !"));
        console.log(e);
    }
});