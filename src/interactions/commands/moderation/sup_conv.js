const {MessageFlags} = require("discord.js");
const {durationFormatter, logWithImage} = require("../../../api/utils.js");
const discordTranscripts = require("discord-html-transcripts");
const {salons} = require("../../../api/permanent");

module.exports = {
    name: "supprimer_conversation",
    description: "Permet de supprimer une conversation (x dernier messages) !",
    devOnly: true,
    options: [{
        name: "nombre",
        description: "Le nombre de message à supprimer. (max 100)",
        type: 4,
        maxValue: 100,
        required: true,
    }],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        const date = Date.now();
        await interaction.deferReply({flags: [MessageFlags.Ephemeral]});
        const nb = interaction.options.getInteger("nombre");
        const oldChannel = interaction.channel;
        await oldChannel.messages.fetch({force: true, limit: 100});
        const msgs = oldChannel.messages.cache.sort((a, b) => b.createdTimestamp - a.createdTimestamp)
            .filter((msg) => !(msg.content === "" && msg.embeds.length === 0 && msg.attachments.size === 0))
            .map((msg) => msg).slice(0, nb)
            .sort((a, b) => a.createdTimestamp - b.createdTimestamp);
        const attachment = await discordTranscripts.generateFromMessages(msgs, oldChannel);

        await interaction.editReply({
            content: `**${msgs.length}/${nb}** messages vont être supprimés !`,
            flags: [MessageFlags.Ephemeral]
        });
        const bDinfo = (await oldChannel.bulkDelete(msgs, false)).map((msg) => msg);
        oldChannel.send({
            content: `Les dernier **${bDinfo.length}** messages ont été supprimés ! (une sauvegarde est disponible dans <#${salons.log}>)`,
        });
        return logWithImage(`**${bDinfo.length}/${msgs.length}** messages ont été supprimés dans <#${oldChannel.id}> en ${durationFormatter(Date.now() - date)} !`, "Suppression de conversation", interaction.member, "warning", attachment);
    }
};