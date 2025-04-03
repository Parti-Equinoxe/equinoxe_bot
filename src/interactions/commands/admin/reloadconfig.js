const {redBright} = require("cli-color");
const {ChatInputCommandInteraction, Client, MessageFlags} = require("discord.js");
const client = require("../../../index.js").client;

module.exports = {
    name: "reload",
    description: "Une commande pour recharger la config du bot.",
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (_, interaction) => {
        await interaction.reply("Rechargement de la configuration du bot !");
        console.log(redBright.bold(`>> Rechargement de la config (par ${interaction.user.username})! <<`));
        client.configHandler.reload();
    },
};
