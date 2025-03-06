const {MessageFlags, Snowflake, ButtonInteraction} = require("discord.js");
const {getChannel, getGuild} = require("./utils");
const {salons, roles} = require("./permanent");
const {client} = require("../index");
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
        name: `🌓│${(await getGuild()).roles.cache.get(roles.adherent).members.size} adhérent(e)s`
    });
};

/**
 * Met a jour les roles (sympathisant) en fct de adherent
 * @param member
 * @return {Promise<void>}
 */
module.exports.updateRoleMember = async (member) => {
    try {
        const adh = module.exports.userARole(member.roles.cache, roles.adherent);
        const symp = module.exports.userARole(member.roles.cache, roles.sympathisant);
        if ((adh && !symp) || (!adh && symp)) return;
        if (adh && symp) {
            await member.roles.remove(roles.sympathisant);
        }
        if (!adh && !symp) {
            await member.roles.add(roles.sympathisant);
        }
    } catch (e) {
        console.log(`>> Erreur de mise à jour de role pour ${member.nickname ?? member.user.username} (${member.id}) : ${e}`);
    }
}

/**
 * Verif que les sympathisants / adherents ont bien le bon role
 * @param members
 * @return {Promise<void>}
 */
module.exports.verifRoles = async (members) => {
    for (const member of members) {
        if (member.user.bot) continue;
        await this.updateRoleMember(member);
    }
}

/**
 * Met à jour les perms du role @sympathisant sur celles de @everyone
 * @param {Snowflake | String} channelID
 */
module.exports.majPermSymp = async (channelID) => {
    const channel = await getChannel(channelID);
    const perms = channel.permissionOverwrites.cache.map(p => {
        return {
            id: p.id, // nouveau role id
            allow: p.allow.toArray(),
            deny: p.deny.toArray()
        };
    }).filter(p => p.id !== roles.sympathisant);//role @everyone
    const perm_everyone = perms.find(p => p.id === client.config.guildID);
    if (!perm_everyone) return;
    perms.push({
        id: roles.sympathisant,
        allow: perm_everyone.allow,
        deny: perm_everyone.deny
    });
    await channel.permissionOverwrites.set(perms,`Copies des permissions de @everyone vers sympathisant`);
}