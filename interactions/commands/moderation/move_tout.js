const {ChannelType} = require("discord.js");
const {getWebhooks} = require("../../../api/utils.js");

module.exports = {
    name: "deplacer_salon",
    description: "Permet de déplacer les message d'un salon (un maximum).",
    options: [{
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
        if (!interaction.channel.isThread()) return interaction.reply({content: "Ce n'est pas un salon de fils !", ephemeral: true});
        interaction.deferReply({ephemeral: true});
        const nb = interaction.options.getInteger("nombre"),
            newChannel = interaction.options.getChannel("salon"),
            oldChannel = interaction.channel;
        await oldChannel.messages.fetch({force: true});
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