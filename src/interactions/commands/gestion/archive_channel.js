const categories = require("../../../data/utils/categories.json");
const {ChannelType,MessageFlags} = require("discord.js");

module.exports = {
    name: "archive",
    description: "Permet d'archiver un salons.",
    options: [{
        name: "salon",
        description: "Salon à archiver.",
        type: 7,
        required: true,
        channelTypes: [0, 5]
    }],
    devOnly: true,
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        const channel = interaction.options.getChannel("salon");
        /*if (channel.) return interaction.reply({
            content: ":page_facing_up: Le salon doit être un salon texte !",
            flags: [MessageFlags.Ephemeral]
        });*/
        if (channel.parentId === categories.archive) return interaction.reply({
            content: ":page_facing_up: Ce salon est déjà archivé.",
            flags: [MessageFlags.Ephemeral]
        });
        await channel.setParent(categories.archive, {lockPermissions: true});
        //await channel.lockPermissions();
        await channel.send({
            content: `:lock: Le salon a été archivé par **${interaction.user.username}** le <t:${Math.floor(Date.now() / 1000)}:f>.`
        });
        /*await api.utils.log({
            content: `:lock: Le salon <#${channel.id}> a été archiver par <@${interaction.user.id}>`,
            allowedMentions: {repliedUser: false}
        });*/
        return interaction.reply({
            content: `:lock: Le salon <#${channel.id}> a bien été archivé.`,
            flags: [MessageFlags.Ephemeral]
        });
    }
};