const { MessageFlags } = require("discord.js");
const { checkGiveRole, userAnyRoles } = require("../../../api/role.js");

module.exports = {
    customID: "give_role",
    runInteraction: async (_, interaction, arguments) => {
        if (arguments.length == 0) {
            console.warn("Le bouton n'est pas encore configuré !");
            return interaction.reply({
                content: `Ce boutton n'est pas encore configuré !`,
                flags: [MessageFlags.Ephemeral]
            });
        }
        const check = checkGiveRole(arguments[0]);
        if (!check.allowed) {
            return interaction.reply({
                content: ":no_entry_sign:" + check.reason,
                flags: [MessageFlags.Ephemeral]
            });
        }
        if (!interaction.member.manageable) return interaction.reply({
            content: ":no_entry_sign: Je n'ai pas la permission de modifier vos roles.",
            flags: [MessageFlags.Ephemeral]
        });
        const roleID = arguments[0];
        const role = await interaction.guild.roles.fetch(roleID);
        if (userAnyRoles(interaction.member.roles.cache, roleID)) {
            await interaction.member.roles.remove(role);
            return interaction.reply({
                content: `Le role <@&${roleID}> vous a bien été retiré.`,
                flags: [MessageFlags.Ephemeral]
            });
        } else {
            await interaction.member.roles.add(role);
            return interaction.reply({
                content: `Le role <@&${roleID}> vous a bien été ajouté.`,
                flags: [MessageFlags.Ephemeral]
            });
        }
    }
}