const {ChannelType} = require("discord.js");
const {getWebhooks} = require("../../../api/utils.js");

module.exports = {
    name: "copier_conversation",
    description: "Permet de déplacer une conversation (x dernier messages), supprime les message en question.",
    options: [{
        name: "nombre",
        description: "Le nombre de message à copier. (max 100)",
        type: 4,
        maxValue: 100,
        required: true,
    }, {
        name: "salon",
        description: "Le salon vers le quel coller la conversation.",
        type: 7,
        required: true,
        channelTypes: [0,5,10,11,12,15]
    }],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        interaction.deferReply({ephemeral: true});
        const nb = interaction.options.getInteger("nombre"),
            newChannel = interaction.options.getChannel("salon"),
            oldChannel = interaction.channel;
        await oldChannel.messages.fetch({force: true, limit: 100});
        const msgs = oldChannel.messages.cache.sort((a, b) => b.createdTimestamp - a.createdTimestamp).filter((msg) => !(msg.content === "" && msg.embeds.length === 0 && msg.attachments.size === 0)).map((msg) => msg).slice(0, nb).sort((a, b) => a.createdTimestamp - b.createdTimestamp);
        for (const message of msgs) {
            await (await getWebhooks(newChannel, message.author)).send({
                content: message.content,
                files: message.attachments,
                embeds: message.embeds
            });
        }
        return interaction.editReply({
            content: `**${msgs.length}** messages ont été déplacer vers <#${newChannel.id}> !`,
            ephemeral: true
        });
    }
};