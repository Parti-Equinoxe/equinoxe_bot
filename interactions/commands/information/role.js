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
        let textes = role.members.map((member) => `<@${member.user.id}>`);
        //console.log(textes);
        if (textes.length === 0) textes = ["Aucun membre n'a ce rôle."];
        const embed = new EmbedBuilder()
            .setColor(couleurs.jaune)
            .setTitle(`${role.members.map((member) => member.user.id).length} membres avec le rôle ${role.name} :`)
            .setDescription(textes.slice(0, 15).join("\n") + (textes.length > 15 ? `\n**${textes.length - 15}** autres membres` : ""))
            .setTimestamp();
        return interaction.reply({embeds: [embed], ephemeral: true});
    },
}