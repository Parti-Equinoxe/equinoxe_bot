const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");
module.exports = {
    customID: "ajouterJM2",
    userOnly: true,
    runInteraction: async (client, interaction) => {
        const modal = new ModalBuilder()
            .setCustomId("ajouterJM2")
            .setTitle("Ajout du nombre de votant par mention:");
        const inputs = [];
        for (const titre_input of ["Éxcellent", "Bien", "Passable", "Insuffisant", "À rejeter"]) {
            const input = new TextInputBuilder()
                .setCustomId(titre_input.replace("É","e").replace("À ","").toLowerCase())
                .setLabel(`Pour la mention ${titre_input} :`)
                .setStyle(TextInputStyle.Short);
            inputs.push(new ActionRowBuilder().addComponents(input));
        }

        modal.addComponents(inputs);
        await interaction.showModal(modal);
    }
}