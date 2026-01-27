const {EmbedBuilder} = require("discord.js");
const {couleurs} = require("../../../api/permanent");
const axios = require("axios");
module.exports = {
    name: "status",
    description: "Permet d'obtenir des informations sur le bot et l'API.",
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        const apiHealth = await axios.get("https://api.parti-equinoxe.fr/version");
        let apiTexte = " :red_circle: API non disponible";
        if (apiHealth.status === 200) {
            apiTexte=`\n> Version : \`v${apiHealth.data.data.version}\``;
            apiTexte+=`\n> Ping : \`${apiHealth.data.temps}ms\``;
        }

        const embed = new EmbedBuilder()
            .setColor(couleurs.jaune)
            .setDescription(`### :robot: BOT :\n> Version : \`v${process.env.npm_package_version}\`\n> Nombre de commandes : \`${client.commands.size}\`\n> Ping : \`${client.ws.ping}ms\`\n### :tools: API :${apiTexte}`)
            .setTimestamp();
        return interaction.reply({embeds: [embed]});
    },
}