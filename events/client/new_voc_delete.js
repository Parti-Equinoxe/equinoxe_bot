const {salons} = require("../../api/permanent.js");
const {Events} = require("discord.js");
const client = require("../../index").client;
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    if (oldState.channel == null || !oldState.channel.name.includes("🔈")) return;
    if (oldState.channel.members.size !== 0) return;
    await oldState.channel.delete();
});