const discordTranscripts = require("discord-html-transcripts");
const {AttachmentBuilder} = require("discord.js");
//const nodeHtmlToImage = require("node-html-to-image");

module.exports = {
    name: "sauvegarder_conversation",
    description: "Permet de sauvegarder une conversation.",
    cooldown: 120,
    options: [{
        name: "nombre",
        description: "Nombre de messages à sauvegarder (max 100).",
        type: 4,
        maxValue: 100,
        required: true
    }],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        //return interaction.reply("Cette commande est en maintenance, elle sera de retour bientôt.");
        await interaction.deferReply()
        const nb = interaction.options.getInteger("nombre");
        await interaction.channel.messages.fetch({force: true, limit: 100});
        const msgList = interaction.channel.messages.cache.sort((a, b) => b.createdTimestamp - a.createdTimestamp).filter((msg) => !(msg.content === "" && msg.embeds.length === 0 && msg.attachments.size === 0)).map((msg) => msg).slice(0, nb).sort((a, b) => a.createdTimestamp - b.createdTimestamp);
        const attachment = await discordTranscripts.generateFromMessages(msgList, interaction.channel);

        /*const png = await nodeHtmlToImage({
            html: attachment.attachment.toString(),
        }).catch(console.error);
        const pngAttachment = new AttachmentBuilder()
            .setFile(png)
            .setName(`Conversation_${interaction.channel.name}_${new Date().toISOString().replace('T', ' ').substring(0, 19).replace(" ", "_")}.png`)
            .setDescription(`${msgList.length} messages. Saved with discord-html-transcripts and exported with node-html-to-image.`);*/

        return interaction.editReply({
            content: `Voici la sauvegarde des **${msgList.length}** messages (à ouvrir dans ton navigateur) :`,
            files: [attachment/*, pngAttachment*/]
        });
    }
};