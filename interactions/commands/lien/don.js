const {ChatInputCommandInteraction, Client} = require("discord.js");

module.exports = {
    name: "don",
    description: "Permet d'obtenir le lien pour faire un don.",
    subCommande: true,
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        interaction.reply({content: "https://parti-equinoxe.fr/faire-un-don/"});
    },
};
