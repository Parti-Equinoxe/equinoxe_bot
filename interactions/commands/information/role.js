const {EmbedBuilder} = require("discord.js");
const {couleurs} = require("../../../api/permanent");
module.exports = {
    name: "role",
    description: "Permet d'obtenir la liste des personnes ayant un certain rôle.",
    options: [
        {
            name: "role",
            description: "Le rôle que vous souhaitez voir.",
            type: 8,
            required: true,
        }
    ],
    runInteraction: async (client, interaction) => {
        const role = interaction.options.getRole("role");
        console.log(role.members.map((member) => member.user.id).length);
        let texte = role.members.map((member) => `<@${member.user.id}>`).join("\n");
        if (texte.length === 0) texte = "Aucun membre n'a ce rôle.";
        if (texte.length > 2000) texte = texte.slice(0, 2000) + "...";
        const embed = new EmbedBuilder()
            .setColor(couleurs.jaune)
            .setTitle(`Membres avec le rôle ${role.name} :`)
            .setDescription(texte)
            .setTimestamp();
        return interaction.reply({embeds: [embed], ephemeral: true});
    },
}