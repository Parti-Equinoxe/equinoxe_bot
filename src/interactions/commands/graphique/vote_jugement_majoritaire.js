const {EmbedBuilder, ButtonBuilder, ActionRowBuilder, MessageFlags} = require("discord.js");
const axios = require('axios');
const {voteJugementMajoritaire} = require("../../../api/graph.js");
const {couleurs} = require("../../../api/permanent.js");
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
        await interaction.deferReply();
        const embed = new EmbedBuilder()
            .setTitle(interaction.options.getString("titre") ?? "Résultat du vote au jugement majoritaire")
            .setColor(couleurs.jaune)
            .setDescription("Utilise les boutons pour ajouter des données !")
            .setTimestamp();
        if (interaction.options.getAttachment("json") && interaction.options.getAttachment("json").contentType.includes("application/json")) {
            embed.setDescription(null);
            embed.setTitle(null);
            const dataUrl = await axios({
                url: interaction.options.getAttachment("json").attachment.toString("utf-8"),
                method: 'GET',
                responseType: 'json',
            }).catch(error => {
                interaction.editReply({
                    content: ":inbox_tray: Le fichier n'a pas pu être téléchargé.",
                    //flags: [MessageFlags.Ephemeral]
                });
                return false;
            });
            if (!dataUrl) return;
            const data = dataUrl.data;
            if (!data.titre) data.titre = interaction.options.getString("titre") ?? "Pas de titre donnée";
            const graph = await voteJugementMajoritaire(data.titre, data.data);
            embed.setImage(`attachment://${graph.name}`);
            return interaction.editReply({embeds: [embed], files: [graph]});
        }

        const btnAjouter = new ButtonBuilder()
            .setCustomId("graph:ajouterJM")
            .setLabel("Ajouter")
            .setEmoji("➕")
            .setDisabled(false)
            .setStyle(1);
        const btnValider = new ButtonBuilder()
            .setCustomId("graph:validerJM")
            .setLabel("Valider")
            .setEmoji("✔")
            .setDisabled(true)
            .setStyle(3);
        const btnAnnuler = new ButtonBuilder()
            .setCustomId("graph:annuler")
            .setLabel("Annuler")
            .setEmoji("✖")
            .setDisabled(false)
            .setStyle(4);

        await interaction.editReply({
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(btnAjouter).addComponents(btnValider).addComponents(btnAnnuler)],
        });
    }
}