const {ChatInputCommandInteraction, Client} = require("discord.js");

module.exports = {
    name: "réseaux",
    description: "Permet d'obtenir les liens des réseaux sociaux.",
    subCommande: true,
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        interaction.reply({content: "https://twitter.com/PartiEquinoxe\nhttps://www.linkedin.com/company/équinoxe/\nhttps://www.instagram.com/parti_equinoxe/\nhttps://www.facebook.com/PartiEquinoxe"});
    },
};
