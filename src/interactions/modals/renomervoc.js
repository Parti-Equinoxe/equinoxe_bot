const {ButtonComponent, ButtonBuilder, ActionRowBuilder} = require("discord.js");
module.exports = {
    customID: "renomervoc",
    /**
     * @param {ModalSubmitInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        if (!interaction.message.mentions.users.map(u => u.id).includes(interaction.user.id)) return interaction.reply({
            content: ":no_entry_sign: Vous n'avez pas la permission de modifier ce vocal.",
            ephemeral: true
        });
        const nom = interaction.fields.getTextInputValue("nom");
        const channel = await interaction.guild.channels.fetch(interaction.channelId);
        await channel.edit({
            name: `🔈│${nom}`
        });
        await interaction.message.delete();
        return interaction.reply({
            content: `Le vocal a bien été renommer en <#${interaction.channelId}>`,
            ephemeral: true
        });
    },
};
