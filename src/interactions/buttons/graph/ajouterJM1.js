const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");
module.exports = {
    customID: "ajouterJM1",
    userOnly: true,
    runInteraction: async (client, interaction) => {
        const modal = new ModalBuilder()
            .setCustomId("ajouterJM1")
            .setTitle("Ajout d'un choix de vote :");

        const titre = new TextInputBuilder()
            .setCustomId("titre")
            .setLabel("Titre :")
            .setStyle(TextInputStyle.Short);
        const description = new TextInputBuilder()
            .setCustomId("nb")
            .setLabel("Nombre de vote totale :")
            .setStyle(TextInputStyle.Short);

        modal.addComponents(new ActionRowBuilder().addComponents(titre), new ActionRowBuilder().addComponents(description));
        await interaction.showModal(modal);
    }
}