const {EmbedBuilder, AttachmentBuilder} = require("discord.js");
const {voteJugementMajoritaire} = require("../../../api/graph.js");

module.exports = {
    customID: "validerJM",
    userOnly: true,
    runInteraction: async (client, interaction) => {
        await interaction.deferReply();
        const votes = interaction.message.embeds[0].fields.map((field) => {
            const voteMention = field.value.split("\n").map((field) => parseInt(field.split("**")[1]) ?? 0);
            const nb_votant = parseInt(field.name.split("**")[1]);
            return {
                titre: field.name.split("(**")[0].trim(),
                nb: nb_votant,
                votes: voteMention,
            }
        });
        const json = new AttachmentBuilder()
            .setName(`vote_result.json`)
            .setDescription("Les données pour : " + interaction.message.embeds[0].title)
            .setFile(Buffer.from(JSON.stringify({titre: interaction.message.embeds[0].title, data: votes}, null, 2)));
        const graph = await voteJugementMajoritaire(interaction.message.embeds[0].title, votes);
        const embed = new EmbedBuilder()
            .setImage(`attachment://${graph.name}`)
            .setColor("#ffd412")
            .setTimestamp();
        return interaction.editReply({embeds: [embed], files: [graph, json]});
    }
}