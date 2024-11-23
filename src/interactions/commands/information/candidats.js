const {banniere, roles, couleurs} = require("../../../api/permanent.js");
const {EmbedBuilder} = require("discord.js");
module.exports = {
    name: "candidats",
    description: "Permet d'obtenir la liste des candidats.",
    runInteraction: async (client, interaction) => {
        const candidats = await interaction.guild.roles.fetch(roles.candidat);
        const embed = new EmbedBuilder()
            .setColor(couleurs.jaune)
            .setTitle("Candidats au législative 2024 :")
            .setDescription(candidats.members.map((m) => `- <@&${m.user.id}>`).join("\n").slice(0, 4000))
            .setTimestamp()
            .setThumbnail(banniere.link)
            .setFooter({text: "Cette liste n'est valable que pour les éléctions indiqué.",});
        return interaction.reply({embeds: [embed], files: [banniere.file()]});
    }
}