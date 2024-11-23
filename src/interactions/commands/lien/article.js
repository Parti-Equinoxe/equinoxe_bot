const {ChatInputCommandInteraction, Client} = require("discord.js");
const {get} = require("axios");

module.exports = {
    name: "article",
    description: "Permet d'obtenir le lien pour faire un don.",
    subCommande: true,
    devOnly: true,
    options: [
        {
            name: "mot_cle",
            description: "Mot clé de l'article.",
            type: 3,
            required: true
        }
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        const url = `https://parti-equinoxe.fr/?s=${interaction.options.getString("mot_cle").replaceAll(" ", "+")}`;
        const response = await get(url);
        console.log(response);
    },
};
