const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder} = require("discord.js");
module.exports = {
    customID: "ajouterJM2",
    runInteraction: async (client, interaction) => {
        const votants = [];
        for (const titre_input of ["éxcellent", "bien", "passable", "insuffisant", "à rejeter"]) {
            let input = parseInt(interaction.fields.getTextInputValue(titre_input.replace("é","e").replace("à ",""))) ?? 0;
            if (input < 0) input = 0;
            votants.push({
                name: titre_input.replace(/(^\w|\s\w)/, (firstLetter) => firstLetter.toUpperCase()) + " :",
                value: `${input}`
            });
        }
        const embed = EmbedBuilder.from(interaction.message.embeds[0])
        .setDescription("Utilise le bouton pour valider ou annuler l'ajout")
        .addFields(votants);
        const btnValider = new ButtonBuilder()
            .setCustomId("graph:validerJM2")
            .setLabel("Valider")
            .setEmoji("✔")
            .setStyle(3);
        const btnAnnuler = new ButtonBuilder()
            .setCustomId("graph:annuler")
            .setLabel("Annuler")
            .setEmoji("✖")
            .setStyle(4);
        await interaction.update({embeds: [embed], components: [new ActionRowBuilder().addComponents(btnValider).addComponents(btnAnnuler)]});
    }
}