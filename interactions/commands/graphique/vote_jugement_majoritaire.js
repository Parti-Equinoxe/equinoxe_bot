const {EmbedBuilder, ButtonBuilder, ActionRowBuilder} = require("discord.js");
const axios = require('axios');
const {voteJugementMajoritaire} = require("../../../api/graph.js");
module.exports = {
    name: "vote_jugement_majoritaire",
    description: "Permet de tracer un graphique de résultat d'un vote au jugement majoritaire.",
    cooldown: 120,
    options: [
        {
            name: "titre",
            description: "Le titre du vote.",
            type: 3,
            required: false
        },
        {
            name: "json",
            description: "Un json pour les données du vote. (dois être au bon format)",
            type: 11,
            required: false
        }
    ],
    runInteraction: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setTitle(interaction.options.getString("titre") ?? "Résultat du vote au jugement majoritaire")
            .setColor("#ffd412")
            .setDescription("Utilise les boutons pour ajouter des données !")
            .setTimestamp();
        if (interaction.options.getAttachment("json").contentType === "application/json; charset=utf-8") {
            embed.setDescription(null);
            embed.setTitle(null);
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
            if (!data.titre) data.titre = interaction.options.getString("titre");
            const graph = await voteJugementMajoritaire(data.titre, data.data);
            embed.setImage(`attachment://${graph.name}`);
            return interaction.reply({embeds: [embed], files: [graph]});
        }

        const btnAjouter = new ButtonBuilder()
            .setCustomId("graph:ajouterJM")
            .setLabel("Ajouter")
            .setEmoji("➕")
            .setDisabled(false)
            .setStyle(1);
        const btnValider = new ButtonBuilder()
            .setCustomId("graph:validerJM")
            .setLabel("Ajouter")
            .setEmoji("✔")
            .setDisabled(true)
            .setStyle(3);
        const btnAnnuler = new ButtonBuilder()
            .setCustomId("graph:annuler")
            .setLabel("Annuler")
            .setEmoji("✖")
            .setDisabled(false)
            .setStyle(4);

        await interaction.reply({
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(btnAjouter).addComponents(btnValider).addComponents(btnAnnuler)],
        });
    }
}