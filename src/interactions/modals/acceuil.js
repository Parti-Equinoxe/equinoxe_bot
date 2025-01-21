const {getGuild} = require("../../api/utils");
module.exports = {
    customID: "accueil",
    /**
     * @param {ModalSubmitInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        const member = await (await getGuild()).members.fetch(interaction.user.id);
        const nom = interaction.fields.getTextInputValue("nom");
        const prenom = interaction.fields.getTextInputValue("prenom");
        if (!prenom || !nom) return interaction.reply({
            content: "Veuillez entrer votre nom et votre prénom, cependant vous n'êtes pas obligé de remplir ce formulaire.",
            ephemeral: true
        });
        const department = parseInt(interaction.fields.getTextInputValue("departement"));
        if (!member.manageable) return interaction.reply({
            content: ":no_entry_sign: Je n'est pas les permissions pour modifier votre profil.",
            ephemeral: true
        });
        await member.setNickname(`${prenom} ${nom}` + (department && department > 1 && department < 1000 ? ` - ${department}` : ""), "Formulaire d'accueil");
        return interaction.reply({content: ":white_check_mark: Votre profil a bien été mis à jour !", ephemeral: true});
    },
};
