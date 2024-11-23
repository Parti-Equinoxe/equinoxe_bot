const {ActionRowBuilder, EmbedBuilder, ButtonBuilder} = require("discord.js");
module.exports = {
    customID: "ajouterJM1",
    runInteraction: async (client, interaction) => {
        const embed = EmbedBuilder.from(interaction.message.embeds[0])
        .setDescription("Utilise le bouton pour ajouter le nombre de votants de chaque mention :")
        .addFields([{
            name: "Titre :",
            value: interaction.fields.getTextInputValue("titre")
        },{
            name: "Nombre de vote totale :",
            value: interaction.fields.getTextInputValue("nb")
        }]);
        const btnAjouter =new ButtonBuilder()
            .setCustomId("graph:ajouterJM2")
            .setLabel("Ouvrir le formulaire")
            .setEmoji("📋")
            .setStyle(1);
        const btnAnnuler = new ButtonBuilder()
            .setCustomId("graph:annuler")
            .setLabel("Annuler")
            .setEmoji("✖")
            .setStyle(4);
        await interaction.update({embeds: [embed], components: [new ActionRowBuilder().addComponents(btnAjouter).addComponents(btnAnnuler)]});
    }
}