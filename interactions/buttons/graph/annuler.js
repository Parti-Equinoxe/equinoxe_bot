module.exports = {
    customID: "annuler",
    userOnly: true,
    runInteraction: async (client, interaction) => {
        return interaction.message.delete();
    }
}