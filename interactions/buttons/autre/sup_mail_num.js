module.exports = {
    customID: "sup_mail_num",
    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        if (!interaction.message.reference) return;
        const msg = await interaction.channel.messages.fetch(interaction.message.reference.messageId);
        if (interaction.user.id !== msg.author.id) return interaction.reply({
            content: `:no_entry_sign: Vous n'avez pas la permission de supprimer ce message.`,
        });
        await interaction.message.delete();
        await msg.delete();
        return interaction.reply({
            content: ":white_check_mark: Votre message contenant des informations de contact a bien été supprimé.",
            ephemeral: true
        });
    },
};
