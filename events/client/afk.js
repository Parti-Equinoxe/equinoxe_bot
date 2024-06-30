const client = require("../../index").client;
const salons = require("../../data/utils/salons.json");
client.on("voiceStateUpdate", async (oldState, newState) => {
    if (newState.channelId !== salons.afk) return;
    await newState.disconnect("Le membre est en AFK !");
})