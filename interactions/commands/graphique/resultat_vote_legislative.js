const axios = require("axios");
const {voteLegislative} = require("../../../api/graph.js");
const {EmbedBuilder} = require("discord.js");
const {jaune} = require("../../../api/permanent.js");
module.exports = {
    name: "résultat_vote_legislative",
    description: "Permet de tracer un graphique d'un vote de legislative.",
    options: [{
        name: "json",
        description: "Un json pour les données du vote. (dois être au bon format)",
        type: 11,
        required: true
    }, {
        name: "titre",
        description: "Le titre du vote.",
        type: 3,
        required: false
    }],
    runInteraction: async (client, interaction) => {
        if (interaction.options.getAttachment("json").contentType !== "application/json; charset=utf-8") return interaction.reply({
            content: ":x: Le fichier doit être au format JSON !",
            ephemeral: true
        });
        const dataUrl = await axios({
            url: interaction.options.getAttachment("json").attachment.toString("utf-8"),
            method: 'GET',
            responseType: 'json',
        }).catch(error => {
            interaction.reply({content: ":inbox_tray: Le fichier n'a pas pu être téléchargé.", ephemeral: true});
            return false;
        });
        if (!dataUrl) return;
        const data = dataUrl.data;
        if (!data.titre) data.titre = interaction.options.getString("titre") ?? "Pas de titre donnée";
        const graph = await voteLegislative(data.titre, data.data);
        const embed = new EmbedBuilder()
            .setColor(jaune)
            .setTimestamp()
            .setImage(`attachment://${graph.name}`);
        return interaction.reply({embeds: [embed], files: [graph]});

    }
}