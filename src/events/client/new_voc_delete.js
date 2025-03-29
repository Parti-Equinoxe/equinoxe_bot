const {Events} = require("discord.js");
const discordTranscripts = require("discord-html-transcripts");
const {logWithImage, durationFormatter} = require("../../api/utils");
const client = require("../../index").client;
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    if (oldState.channel == null || !oldState.channel.name.includes("🔈")) return;
    if (oldState.channel.members.size !== 0) return;
    const channel = oldState.channel;
    await channel.messages.fetch({force: true, limit: 100});
    console.log(channel.messages.cache.map((m)=>m).length);
    const nb= Math.min(channel.messages.cache.map((m)=>m).length, 100);
    const msgs = channel.messages.cache.sort((a, b) => b.createdTimestamp - a.createdTimestamp)
        .filter((msg) => !(msg.content === "" && msg.embeds.length === 0 && msg.attachments.size === 0))
        .map((msg) => msg).slice(0, nb)
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp);
    const attachment = await discordTranscripts.generateFromMessages(msgs, channel);
    await logWithImage(`Sauvegarde des dernier **${msgs.length}** messages du vocal **${channel.name}**.`, "Sauvegarde Vocal Automatique", oldState.member, "success", attachment);
    await oldState.channel.delete();
});