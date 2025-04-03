const { MessageFlags } = require("discord.js");
const { getChannel, getGuild } = require("./utils.js");
const client = require("../index.js").client;
/**
 * @param {ButtonInteraction} interaction
 */
module.exports.rolereact = async (interaction, roleID) => {
    const role = await interaction.guild.roles.fetch(roleID);
    if (!interaction.member.manageable) return interaction.reply({
        content: ":no_entry_sign: Je n'ai pas la permission de modifier vos roles.",
        flags: [MessageFlags.Ephemeral]
    });
    if (this.userAnyRoles(interaction.member.roles.cache, roleID)) {
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
 * @param {Role.id | string} roleID - l'ID du role en question
 * @returns {{allowed: boolean, reason?: string}} - Le field reason est définie si allowed est à false.
 */
module.exports.checkGiveRole = (roleID) => {
    const config = {};
    if (client.configHandler.tryGet("blackListedGiveRoles", config)) {
        if (config.value[roleID]) {
            return {
                allowed: false,
                reason: config.value[roleID].reason ?? "Ce role est blacklisté !"
            }
        }
    }
    return {
        allowed: true,
    }
}

/**
 * @param {string} category - la catégorie de la commande
 * @param {GuildMember} member - le membre qui a fait la commande
 * @returns {{allowed: boolean, reason?: string}} - Le field reason est définie si allowed est à false.
 */ // Je ne suis pas sur ce que ce sois un GuildMember
module.exports.checkMemberRoleCommand = (member, category) => {
    const config = {};
    if (client.configHandler.tryGet("commandCategoryRequireRole", config)) {
        if (config.value[category] && !this.userAnyRoles(member.roles.cache, ...config.value[category].roles)) {
            return {
                allowed: false,
                reason: config.value[category].reason ?? "Vous n'avez pas la permission !"
            }
        }
    }
    return {
        allowed: true,
    }
}

/**
 * @param {DataManager.cache} rolesUser - les roles de l'utilisateur (**interaction.member.roles.cache**)
 * @param {...Role.id | string} roleIDs - l'ID du role en question
 * @return {boolean} - si l'utilisateur a le role
 */
module.exports.userAnyRoles = (rolesUser, ...roleIDs) => {
    return roleIDs.some((roleID) => rolesUser.has(roleID));
};

/**
 * Permet de mettre a jour les compteurs (salons)\
 * **Le bot doit avoir comme perm sur le salon : Voir et Se connecter**
 * @returns {Promise<void>}
 */
module.exports.channelRoleCounter = async () => {
    const config = {};
    if (!client.configHandler.tryGet("counters", config))
        return;

    for (const role in config.value) {
        const channel = config.value[role].channel;
        const message = config.value[role].message;
        const count = role === "membres"
            ? (await getGuild()).memberCount
            : (await getGuild()).roles.cache.get(role)?.members?.size ?? 0;

        await (await getChannel(channel)).edit({
            name: message.replace("%count%", count)
        });
    }
};

/**
 * Met a jour les roles (sympathisant) en fct de adherent
 * @param member
 * @return {Promise<void>}
 */
module.exports.updateRoleMember = async (member) => {
    try {
        const config = {};
        if (!client.configHandler.tryGet("conflictRoles", config))
            return;

        const adh = module.exports.userAnyRoles(member.roles.cache, config.value.adherent);
        const symp = module.exports.userAnyRoles(member.roles.cache, config.value.sympathisant);
        if (adh) {
            if (symp) {
                await member.roles.remove(config.value.sympathisant);
            }
        }
        else if (!symp) {
            await member.roles.add(config.value.sympathisant);
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