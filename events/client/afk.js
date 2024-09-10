const {salons} = require("../../api/permanent.js");
const client = require("../../index").client;
const { Events } = require('discord.js');
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    if (newState.channelId !== salons.afk) return;
    await newState.disconnect("Le membre est en AFK !");
})