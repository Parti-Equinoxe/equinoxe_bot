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
            content: ":equinoxe: Bonjour, vous pouvez **remplir le formulaire** (*Nom, Prénom, Département*) ci-dessous pour vous __renommer__ et permettre une meilleure intégration.\nAucune des ces informations ne seront enregistrer.",
            components: [new ActionRowBuilder().addComponents(btnForm)],
        });
    }
}