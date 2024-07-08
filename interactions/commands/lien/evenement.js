const {ChatInputCommandInteraction, Client} = require("discord.js");

module.exports = {
    name: "événements",
    description: "Permet d'obtenir le lien des prochains événements.",
    subCommande: true,
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        return interaction.reply({content: "https://parti-equinoxe.fr/evenements/"});
    },
};
