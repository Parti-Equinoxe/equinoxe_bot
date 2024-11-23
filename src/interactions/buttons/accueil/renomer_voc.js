const {ModalBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder} = require("discord.js");
module.exports = {
    customID: "renomervoc",
    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        if (!interaction.message.mentions.users.map(u => u.id).includes(interaction.user.id)) return interaction.reply({
            content: ":no_entry_sign: Vous n'avez pas la permission de modifier ce vocal.",
            ephemeral: true
        });
        const modal = new ModalBuilder()
            .setCustomId("renomervoc")
            .setTitle("Renomer le vocal");

        const input = new TextInputBuilder()
            .setCustomId("nom")
            .setLabel("Le nouveau nom :")
            .setStyle(TextInputStyle.Short)
            .setMinLength(2)
            .setMaxLength(50);

        modal.addComponents(new ActionRowBuilder().addComponents(input));

        await interaction.showModal(modal);
    },
};