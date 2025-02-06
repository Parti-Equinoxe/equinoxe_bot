const { MessageFlags}= require("discord.js");
module.exports = {
    customID: "administrateur",
    runInteraction: async (client, interaction) => {
        return interaction.reply({
            content: ":not_entry_sign: Pour être administrateur il faut voir avec le bureau.",
            flags: [MessageFlags.Ephemeral]
        })
    }
}