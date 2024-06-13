const {ModalBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder} = require("discord.js");
module.exports = {
    customID: "formulaire",
    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        const modal = new ModalBuilder()
			.setCustomId("accueil")
            .setTitle("Formulaire d'accueil");

        const nomInput = new TextInputBuilder()
            .setCustomId("nom")
            .setLabel("Quel est votre nom ?")
            .setStyle(TextInputStyle.Short);
        const prenomInput = new TextInputBuilder()
            .setCustomId("prenom")
            .setLabel("Quel est votre prénom ?")
            .setStyle(TextInputStyle.Short);
        const departementInput = new TextInputBuilder()
            .setCustomId("departement")
            .setLabel("Quel est votre département ?")
            .setStyle(TextInputStyle.Short);

        modal.addComponents(new ActionRowBuilder().addComponents(nomInput), new ActionRowBuilder().addComponents(prenomInput), new ActionRowBuilder().addComponents(departementInput));

        await interaction.showModal(modal);
    },
};
