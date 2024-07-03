/**
 * @param {ButtonInteraction} interaction
 */
module.exports.rolereact = async (interaction, roleID) => {
    const role = await interaction.guild.roles.fetch(roleID);
    if (!interaction.member.manageable) return interaction.reply({
        content: ":x: Je n'ai pas la permission de modifier vos roles.",
        ephemeral: true
    });
    if (this.userARole(interaction.member.roles.cache, roleID)) {
        await interaction.member.roles.remove(role);
        await interaction.reply({
            content: `Le role <@&${roleID}> vous a bien été retiré.`,
            ephemeral: true
        });
    } else {
        await interaction.member.roles.add(role);
        await interaction.reply({
            content: `Le role <@&${roleID}> vous a bien été ajouté.`,
            ephemeral: true
        });
    }
}

/**
 * @param {DataManager.cache} rolesUser - les roles de l'utilisateur (**interaction.member.roles.cache**)
 * @param {Role.id | string} roleID - l'ID du role en question
 * @return {boolean} - si l'utilisateur a le role
 */
module.exports.userARole = (rolesUser, roleID) => {
    return rolesUser.has(roleID);//.valueOf().some((role) => role == roleID); //faut pas mettre "===" car ils ont pas le même type
};