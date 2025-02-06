const { MessageFlags}= require("discord.js");
module.exports = {
    customID: "admin_site_internet",
    runInteraction: async (client, interaction) => {
        return interaction.reply({
            content: ":no_entry_sign: Seul les personnes ayant accès au panel admin du site ont se rôle, aller dans <#1268310816092979261> pour le demander.",
            flags: [MessageFlags.Ephemeral]
        })
    }
}