const {EmbedBuilder, ButtonBuilder, ActionRowBuilder} = require("discord.js");
module.exports = {
    name: "vote_jugement_majoritaire",
    description: "Permet de tracer un graphique de résultat d'un vote au jugement majoritaire.",
    options: [
        {
            name: "titre",
            description: "Le titre du vote.",
            type: 3,
            required: true
        }
    ],
    runInteraction: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setTitle(interaction.options.getString("titre"))
            .setColor("#ffd412")
            .setDescription("Utilise les bouton pour ajouter des données !")
            .setTimestamp();

        const btnAjouter = new ButtonBuilder()
            .setCustomId("graph:ajouterJM")
            .setLabel("Ajouter")
            .setEmoji("➕")
            .setDisabled(false)
            .setStyle(1);
        const btnValider = new ButtonBuilder()
            .setCustomId("graph:validerJM")
            .setLabel("Ajouter")
            .setEmoji("✔")
            .setDisabled(true)
            .setStyle(3);
        const btnAnnuler = new ButtonBuilder()
            .setCustomId("graph:annuler")
            .setLabel("Annuler")
            .setEmoji("✖")
            .setDisabled(false)
            .setStyle(4);

        await interaction.reply({
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(btnAjouter).addComponents(btnValider).addComponents(btnAnnuler)],
        });
    }
}