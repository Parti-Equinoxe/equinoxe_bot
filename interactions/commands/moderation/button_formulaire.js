const {ButtonBuilder, ActionRowBuilder} = require("discord.js");
module.exports = {
    name: "formulaire_arrivé",
    description: "Permet de sélectionner un formulaire arrivé.",
    runInteraction: async (client, interaction) => {
        const btnForm = new ButtonBuilder()
            .setCustomId("accueil:formulaire")
            .setLabel("Formulaire")
            .setEmoji("📝")
            .setStyle(1);

        return interaction.reply({
            content: "Bonjour, vous pouvez remplir le formulaire si dessous.",
            components: [new ActionRowBuilder().addComponents(btnForm)],
        });
    }
}