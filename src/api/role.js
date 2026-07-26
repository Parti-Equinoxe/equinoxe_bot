const {MessageFlags, Snowflake, ButtonInteraction} = require("discord.js");
const {getChannel, getGuild} = require("./utils");
const {salons, roles} = require("./permanent");
const {client} = require("../index");
const config = require("./../data/utils/config_role_react.json")
const axios = require("axios");
/**
 * @param {ButtonInteraction} interaction
 */
module.exports.rolereact = async (interaction, roleID) => {
    const adh = module.exports.userARole(interaction.member.roles.cache, roles.adherent);
    if (!adh) return interaction.reply({
        content: `:no_entry_sign: Vous devez être adhérent(e) et avoir lié votre compte (<#${salons.a_lire_adherents}>) pour pouvoir prendre des rôles.`,
        flags: [MessageFlags.Ephemeral]
    })
    const role = await interaction.guild.roles.fetch(roleID);
    if (!interaction.member.manageable) return interaction.reply({
        content: ":no_entry_sign: Je n'ai pas la permission de modifier vos roles.",
        flags: [MessageFlags.Ephemeral]
    });
    if (this.userARole(interaction.member.roles.cache, roleID)) {
        await interaction.member.roles.remove(role);
        return interaction.reply({
            content: `Le role <@&${roleID}> vous a bien été **retiré**.`,
            flags: [MessageFlags.Ephemeral]
        });
    } else {
        await interaction.member.roles.add(role);
        const roleName = Object.keys(roles).find(k => roles[k] === roleID);
        if (!!roleName && !!config.message[roleName]) {
            const channel = await interaction.guild.channels.fetch(salons[config.message[roleName]]);
            channel.send({content: `<@${interaction.user.id}> vient de rejoindre l'équipe !`});
        }
        return interaction.reply({
            content: `Le role <@&${roleID}> vous a bien été **ajouté**.`,
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
    await (await getChannel(salons.compteur_connecte)).edit({
        name: `🌓│${(await getGuild()).roles.cache.get(roles.adherent).members.size} connecté(e)s`
    });
    //crash pour le moment
    /*try {
        const nb =(await axios.get("https://api.parti-equinoxe.fr/brevo/nombre_adherents")).data.nombre ?? 0;
        await (await getChannel(salons.compteur_adh)).edit({
            name: `🌓│${nb} adhérent(e)s`
        });
    } catch (e) {
        console.log(`>> Erreur de mise à jour du compteur d'adhérents : ${e}`);
        await (await getChannel(salons.compteur_adh)).edit({
            name: `🌓│🛠️🛠️ adhérent(e)s`
        });
    }*/
};

/**
 * Met a jour les roles (sympathisant) en fct de adherent
 * @param {String} member
 * @return {Promise<void>}
 */
module.exports.updateRoleMember = async (member) => {
    try {
        const adh = module.exports.userARole(member.roles.cache, roles.adherent);
        const symp = module.exports.userARole(member.roles.cache, roles.sympathisant);
        const invite = module.exports.userARole(member.roles.cache, roles.invite);
        const autorise = adh || invite;
        if ((autorise && !symp) || (!autorise && symp)) return;
        if (autorise && symp) {
            await member.roles.remove(roles.sympathisant);
        }
        if (!autorise && !symp) {
            await member.roles.add(roles.sympathisant);
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
        const symp = module.exports.userARole(member.roles.cache, roles.sympathisant);
        if (!symp) return;
        if (member.roles.cache.size === 1) return;
        for (const role of member.roles.cache.map(r => r)) {
            if (role.id === roles.sympathisant || role.id === member.guild.id) continue;
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
    const channel = await getChannel(channelID);
    const perms = channel.permissionOverwrites.cache.map(p => {
        return {
            id: p.id,
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
    await channel.permissionOverwrites.set(perms, `Copies des permissions de @everyone vers sympathisant`);
}

/**
 * Met à jour les perms du role @sympathisant sur celles de @everyone
 * @param {Snowflake | String} channelID
 */
module.exports.majPermInvite = async (channelID) => {
    const channel = await getChannel(channelID);
    const perms = channel.permissionOverwrites.cache.map(p => {
        return {
            id: p.id,
            allow: p.allow.toArray(),
            deny: p.deny.toArray()
        };
    }).filter(p => p.id !== roles.invite);
    const perm_everyone = perms.find(p => p.id === roles.adherent);
    if (!perm_everyone) return;
    perms.push({
        id: roles.invite,
        allow: perm_everyone.allow,
        deny: perm_everyone.deny
    });
    await channel.permissionOverwrites.set(perms, `Copies des permissions de adherent vers invite`);
}

/**
 * @param {String} memberID
 * @param {String} role
 * @return {boolean}
 */
module.exports.ajoutRole = async (memberID, role) => {
    const member = await (await getGuild()).members.fetch(memberID);
    const adh = module.exports.userARole(member.roles.cache, roles.adherent);
    if (!adh) return false
    await member.roles.add(role);
    return true
}