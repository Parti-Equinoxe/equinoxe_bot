const client = require("../../index").client;
const { Events } = require('discord.js');
const configHandler = require("../../index").client.configHandler;

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    const config = {};
    if (!configHandler.tryGet("afkChanel", config)) return;
    if (newState.channelId !== config.value) return;
    await newState.disconnect("Le membre est AFK !");
});