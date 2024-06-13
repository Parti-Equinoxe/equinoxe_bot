const {ChatInputCommandInteraction, Client} = require("discord.js");

module.exports = {
    name: "manifest",
    description: "Permet d'obtenir le lien du manifest.",
    subCommande: true,
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        interaction.reply({content: "https://parti-equinoxe.fr/notre-vision/"});
    },
};
