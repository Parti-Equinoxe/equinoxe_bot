const {MessageFlags} = require("discord.js");
const {getChannel, getGuild} = require("./utils");
const {salons, roles} = require("./permanent");
/**
 * @param {ButtonInteraction} interaction
 */
module.exports.rolereact = async (interaction, roleID) => {
    const role = await interaction.guild.roles.fetch(roleID);
    if (!interaction.member.manageable) return interaction.reply({
        content: ":no_entry_sign: Je n'ai pas la permission de modifier vos roles.",
        flags: [MessageFlags.Ephemeral]
    });
    if (this.userARole(interaction.member.roles.cache, roleID)) {
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

/**
 * @param {DataManager.cache} rolesUser - les roles de l'utilisateur (**interaction.member.roles.cache**)
 * @param {Role.id | string} roleID - l'ID du role en question
 * @return {boolean} - si l'utilisateur a le role
 */
module.exports.userARole = (rolesUser, roleID) => {
    return rolesUser.has(roleID);//.valueOf().some((role) => role == roleID); //faut pas mettre "===" car ils ont pas le même type
};

/**
 * Permet de mettre a jour les compteurs (salons)\
 * **Le bot doit avoir comme perm sur le salon : Voir et Se connecter**
 * @returns {Promise<void>}
 */
module.exports.channelRoleCounter = async () => {
    await (await getChannel(salons.compteur)).edit({
        name: `🌓│${(await getGuild()).memberCount} membres`
    });
    await (await getChannel(salons.compteur_adh)).edit({
        name: `🌓│${(await getGuild()).roles.cache.get(roles.adherent).members.size} connectés`
    });
};