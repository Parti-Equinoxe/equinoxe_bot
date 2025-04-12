const { MessageFlags, Snowflake, ButtonInteraction } = require("discord.js");
const { getChannel, getGuild } = require("./utils.js");
const { client } = require("../index.js");
/**
 * @param {ButtonInteraction} interaction
 */
module.exports.rolereact = async (interaction, roleID) => {
    const configAdherent = {};
    if (client.configHandler.tryGet("adherentRole", configAdherent)) // TODO: retravailer la config des roles
    {
        const adh = module.exports.userAnyRoles(interaction.member.roles.cache, configAdherent.value);
        if (!adh) {
            const aLireAdherentsConfig = {};
            if (!client.configHandler.tryGet("aLireAdherents", aLireAdherentsConfig)) {
                return interaction.reply({
                    content: `:no_entry_sign: Vous devez être adhérent(e) et avoir lié votre compte.`,
                    flags: [MessageFlags.Ephemeral]
                });
            }

            return interaction.reply({
                content: `:no_entry_sign: Vous devez être adhérent(e) et avoir lié votre compte (<#${aLireAdherentsConfig.value}>) pour pouvoir prendre des rôles.`,
                flags: [MessageFlags.Ephemeral]
            })
        }
    }
    const check = this.checkGiveRole(arguments[0]);
    if (!check.allowed) {
        return interaction.reply({
            content: ":no_entry_sign:" + check.reason,
            flags: [MessageFlags.Ephemeral]
        });
    }
    const role = await interaction.guild.roles.fetch(roleID);
    if (!interaction.member.manageable) return interaction.reply({
        content: ":no_entry_sign: Je n'ai pas la permission de modifier vos roles.",
        flags: [MessageFlags.Ephemeral]
    });
    if (this.userAnyRoles(interaction.member.roles.cache, roleID)) {
        await interaction.member.roles.remove(role);
        return interaction.reply({
            content: `Le role <@&${roleID}> vous a bien été **retiré**.`,
            flags: [MessageFlags.Ephemeral]
        });
    } else {
        await interaction.member.roles.add(role);
        return interaction.reply({
            content: `Le role <@&${roleID}> vous a bien été **ajouté**.`,
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
    try { // TODO conflictRoles a été retirée, utiliser dictement les roles
        const configAdherent = {};
        const configSympathisant = {};
        if (!client.configHandler.tryGet("adherentRole", configAdherent))
            return;

        if (!client.configHandler.tryGet("sympathisantRole", configSympathisant))
            return;

        const adh = module.exports.userAnyRoles(member.roles.cache, configAdherent.value);
        const symp = module.exports.userAnyRoles(member.roles.cache, configSympathisant.value);
        if (adh) {
            if (symp) {
                await member.roles.remove(configAdherent.value.sympathisant);
            }
        }
        else if (!symp) {
            await member.roles.add(configAdherent.value.sympathisant);
        }
    } catch (e) {
        console.log(`>> Erreur de mise à jour de role pour ${member.nickname ?? member.user.username} (${member.id}) : ${e}`);
    }
}

/**
 * Supprime les roles (si sympathisant)
 * @param member
 * @return {Promise<void>}
 */
module.exports.removeRoleMember = async (member) => {
    try {
        const configSympathisant = {};
        if (!client.configHandler.tryGet("sympathisantRole", configSympathisant)) return;

        const symp = module.exports.userARole(member.roles.cache, configSympathisant.value);
        const symp = module.exports.userAnyRoles(member.roles.cache, configSympathisant.value);
        if (!symp) return;
        if (member.roles.cache.size === 1) return;
        for (const role of member.roles.cache.map(r => r)) {
            if (role.id === configSympathisant.value || role.id === member.guild.id) continue;
            await member.roles.remove(role);
        }
    } catch (e) {
        console.log(`>> Erreur de suppression de role pour ${member.nickname ?? member.user.username} (${member.id}) : ${e}`);
        console.log(role.name);
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
        await this.removeRoleMember(member);
    }
}

/**
 * Met à jour les perms du role @sympathisant sur celles de @everyone
 * @param {Snowflake | String} channelID
 */
module.exports.majPermSymp = async (channelID) => {
    const configSympathisant = {};
    if (!client.configHandler.tryGet("sympathisantRole", configSympathisant)) return;

    const channel = await getChannel(channelID);
    const perms = channel.permissionOverwrites.cache.map(p => {
        return {
            id: p.id,
            allow: p.allow.toArray(),
            deny: p.deny.toArray()
        };
    }).filter(p => p.id !== configSympathisant.value);//role @everyone
    const perm_everyone = perms.find(p => p.id === client.config.guildID);
    if (!perm_everyone) return;
    perms.push({
        id: configSympathisant.value,
        allow: perm_everyone.allow,
        deny: perm_everyone.deny
    });
    await channel.permissionOverwrites.set(perms, `Copies des permissions de @everyone vers sympathisant`);
}

/**
 * Met à jour les perms du role @sympathisant sur celles de @everyone
 * @param {Snowflake | String} channelID
 */
module.exports.majPermInvite = async (channelID) => {
    const configAdherent = {};
    if (!client.configHandler.tryGet("adherentRole", configAdherent)) return;
    const configInvite = {};
    if (!client.configHandler.tryGet("inviteRole", configInvite)) return;

    const channel = await getChannel(channelID);
    const perms = channel.permissionOverwrites.cache.map(p => {
        return {
            id: p.id,
            allow: p.allow.toArray(),
            deny: p.deny.toArray()
        };
    }).filter(p => p.id !== configInvite.value);
    const perm_everyone = perms.find(p => p.id === configAdherent.value);
    if (!perm_everyone) return;
    perms.push({
        id: configInvite.value,
        allow: perm_everyone.allow,
        deny: perm_everyone.deny
    });
    await channel.permissionOverwrites.set(perms, `Copies des permissions de adherent vers invite`);
}