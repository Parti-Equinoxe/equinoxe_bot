module.exports = {
    customID: "annuler",
    userOnly: true,
    runInteraction: async (client, interaction) => {
        if (interaction.message.reference) {
            const msgJM = await interaction.channel.messages.fetch(interaction.message.reference.messageId);
            if (msgJM.components[0]) {
                msgJM.components[0].components[0].data.disabled = false;
                msgJM.components[0].components[1].data.disabled = false;
                msgJM.components[0].components[2].data.disabled = false;
                await msgJM.edit({components: [msgJM.components[0]]});
            }
        }
        return interaction.message.delete();
    }
}