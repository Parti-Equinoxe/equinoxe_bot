const {ChatInputCommandInteraction, Client} = require("discord.js");

module.exports = {
    name: "site",
    description: "Permet d'obtenir le lien du site du parti.",
    subCommande: true,
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        return interaction.reply({content: "https://parti-equinoxe.fr/"});
    },
};
