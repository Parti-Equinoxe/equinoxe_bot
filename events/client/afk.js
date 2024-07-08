const {salons} = require("../../api/permanent.js");
const client = require("../../index").client;
client.on("voiceStateUpdate", async (oldState, newState) => {
    if (newState.channelId !== salons.afk) return;
    await newState.disconnect("Le membre est en AFK !");
})