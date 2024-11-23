module.exports = {
    customID: "sup_msg_ref",
    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        console.log("sup_msg_ref")
        console.log(interaction.message.reference);
        if (!interaction.message.reference) return interaction.message.delete();
        const msg = await interaction.channel.messages.fetch(interaction.message.reference.messageId);
        if (!msg) return;
        if (interaction.user.id !== msg.author.id) return interaction.reply({
            content: `:no_entry_sign: Vous n'avez pas la permission de supprimer ce message.`,
            ephemeral: true
        });
        await interaction.message.delete();
        return interaction.reply({
            content: ":white_check_mark: L'avertissement a bien été supprimée.",
            ephemeral: true
        });
    },
};
