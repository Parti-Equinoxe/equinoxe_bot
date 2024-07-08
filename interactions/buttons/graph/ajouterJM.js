const {ActionRowBuilder, EmbedBuilder, ButtonBuilder} = require("discord.js");
module.exports = {
    customID: "ajouterJM",
    userOnly: true,
    runInteraction: async (client, interaction) => {
        interaction.message.components[0].components[0].data.disabled = true;
        interaction.message.components[0].components[1].data.disabled = true;
        interaction.message.components[0].components[2].data.disabled = true;
        await interaction.message.edit({components: [interaction.message.components[0]]});

        const embed = new EmbedBuilder()
            .setTitle("Ajout d'un choix de vote :")
            .setColor("#5a64ea")
            .setDescription("Utilise le bouton pour ajouter le titre et le nombre de votants :")
            .setTimestamp();

        const btnAjouter = new ButtonBuilder()
            .setCustomId("graph:ajouterJM1")
            .setLabel("Ouvrir le formulaire")
            .setEmoji("📋")
            .setStyle(1);
        const btnAnnuler = new ButtonBuilder()
            .setCustomId("graph:annuler")
            .setLabel("Annuler")
            .setEmoji("✖")
            .setStyle(4);

        await interaction.reply({embeds: [embed], components: [new ActionRowBuilder().addComponents(btnAjouter).addComponents(btnAnnuler)]});
    }
}