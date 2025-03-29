const {client} = require("../../index");
const {Events} = require("discord.js");

client.on(Events.ThreadCreate, async (thread) => {
    let config = {};
    if (!client.configHandler.tryGetFrist((key, value) => key == thread.parentId, config, "postPing"))
        return;
    if (config.value.pingNewPost === undefined)
        return;
    const pings = thread.appliedTags.map((t) => {
        if (config.value.pingNewPost[t] === undefined) return "";
        return `<@&${config.value.pingNewPost[t]}>`
    }).join(" ");
    if (!pings)
        return;
    if (config.value.messageNewPost === null) {
        await thread.send({
            content: config.value.messageNewPost.replace("%pings%", pings)
        });
    }
    else {
        await thread.send({
            content: pings
        });
    }
});

client.on(Events.ThreadUpdate, async (oldThread, newThread) => {
    let config = {};
    if (!client.configHandler.tryGetFrist((key, value) => key == newThread.parentId, config, "postPing"))
        return;
    if (config.value.pingDonePost === undefined)
        return;
    if (oldThread.appliedTags.join("") === newThread.appliedTags.join(""))
        return;
    if (!config.value.pingDonePost.some((element, index, array) => newThread.appliedTags.includes(element)))
        return;
    if (config.value.messageDonePost !== null) {
        await newThread.send({
            content: config.value.messageDonePost
        });
    }
    return newThread.setArchived(true, "Travail terminer");
});