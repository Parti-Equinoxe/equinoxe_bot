const {ChannelType} = require("discord.js");
const {getWebhooks} = require("../../../api/utils.js");

module.exports = {
    name: "deplacer_conversation",
    description: "Permet de déplacer une conversation (x dernier messages), supprime les message en question.",
    options: [{
        name: "nombre",
        description: "Le nombre de message à déplacer. (max 100)",
        type: 4,
        maxValue: 100,
        required: true,
    }, {
        name: "salon",
        description: "Le salon vers le quel déplacer la conversation.",
        type: 7,
        required: true,
        channelTypes: [0,5,10,11,12,15]
    }],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        await interaction.deferReply({ephemeral: true});
        const nb = interaction.options.getInteger("nombre"),
            newChannel = interaction.options.getChannel("salon"),
            oldChannel = interaction.channel;
        await oldChannel.messages.fetch({force: true, limit: 100});
        const msgs = oldChannel.messages.cache.sort((a, b) => b.createdTimestamp - a.createdTimestamp).filter((msg) => !(msg.content === "" && msg.embeds.length === 0 && msg.attachments.size === 0)).map((msg) => msg).slice(0, nb).sort((a, b) => a.createdTimestamp - b.createdTimestamp);
        const bDinfo = (await oldChannel.bulkDelete(msgs, false)).map((msg) => msg);
        for (const message of msgs) {
            await (await getWebhooks(newChannel, message.author)).send({
                content: message.content,
                files: message.attachments,
                embeds: message.embeds
            });
        }
        return interaction.editReply({
            content: `**${bDinfo.length}** messages ont été déplacer vers <#${newChannel.id}> !`,
            ephemeral: true
        });
    }
};