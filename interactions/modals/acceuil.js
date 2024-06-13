module.exports = {
    customID: "accueil",
    /**
     * @param {ModalSubmitInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        const nom = interaction.fields.getTextInputValue("nom");
        const prenom = interaction.fields.getTextInputValue("prenom");
        const department = interaction.fields.getTextInputValue("departement");
        if (!interaction.member.moderatable) return interaction.reply({
            content: ":no_entry_sign: Je n'est pas les permissions pour modifier votre profil.",
            ephemeral: true
        });
        await interaction.member.setNickname(`${prenom} ${nom} - ${department}`,"Formulaire d'accueil");
        return interaction.reply({content: ":white_check_mark: Votre profil a bien été mis à jour !", ephemeral: true});
    },
};
