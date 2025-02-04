const {PermissionsBitField, Collection, MessageFlags} = require("discord.js");
const {userARole} = require("../../api/role.js");
const {roles} = require("../../api/permanent.js");

const cooldown = new Collection();

module.exports = async (client, interaction) => {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return [false, {content: "Cette commande ne semble pas exister !", flags: [MessageFlags.Ephemeral]}];
    const channel = interaction.channel ?? (await interaction.guild.channels.fetchActiveThreads()).threads.get(interaction.channelId);
    if (!cmd.mp && channel.isDMBased()) {
        return [false, {content: `Cette commande ne peut pas être fait en en MP !Allez sur **un serveur** pour fait votre commande.`}];
    }
    //Vérifie si l'utilisateur est du CE
    if ("ce" === cmd.category && !(userARole(interaction.member.roles.cache, roles.comite_ethique))) {
        return [false, {
            content: ":no_entry_sign: Vous ne faite pas partie du Comité d'Éthique.",
            flags: [MessageFlags.Ephemeral]
        }];
    }
    //Vérifie si l'utilisateur est du staff pour les cmd de moderation
    if (["moderation", "gestion"].includes(cmd.category) && !(userARole(interaction.member.roles.cache, roles.moderation) /*|| userARole(interaction.member.roles.cache, roles.secretariat_general)*/ || userARole(interaction.member.roles.cache, roles.bureau))) {
        return [false, {
            content: ":no_entry_sign: Vous ne faite pas partie de l'équipe de modération.",
            flags: [MessageFlags.Ephemeral]
        }];
    }
    //Vérifie si l'utilisateur est owner en cas de commande admin
    if (cmd.category === "admin" && !(userARole(interaction.member.roles.cache, roles.administrateur) || userARole(interaction.member.roles.cache, roles.bureau))) {
        return [false, {content: ":no_entry_sign: Vous êtes pas administrateur du bot !", flags: [MessageFlags.Ephemeral]}];
    }
    //Vérifie si l'utilisateur est owner en cas de commande dev only
    if (cmd.devOnly && !client.config.dev.includes(interaction.user.id)) {
        return [false, {content: ":tools: Commande en développement !", flags: [MessageFlags.Ephemeral]}];
    }
    //Vérifie les permissions :
    if ((cmd.userPermissions || cmd.botPermissions) && !channel.isDMBased()) {//si dm pas permission
        //Vérifie les permissions du bot pour executer le code
        if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(cmd.botPermissions || []))) {
            return [false, {
                content: `Le bot a besoin des permissions suivante : \`${cmd.botPermissions.join(", ")}\``,
                flags: [MessageFlags.Ephemeral]
            }];
        }
        //Vérifie les permissions du bot pour executer le code
        if (!interaction.guild.members.cache.get(interaction.user.id).permissions.has(PermissionsBitField.resolve(cmd.userPermissions || []))) {
            return [false, {
                content: `Vous avez besoin des permissions suivante : \`${cmd.userPermissions.join(", ")}\``,
                flags: [MessageFlags.Ephemeral]
            }];
        }
    }
    //Execution vérification pour cooldown
    if (cmd.cooldown && !cmd.devOnly) {
        if (cooldown.has(`${cmd.name}${interaction.user.id}`)) {
            const t = Math.floor((cooldown.get(`${cmd.name}${interaction.user.id}`)) / 1000);
            return [false, {content: `Cette commande à un cooldown, il reste <t:${t}:R> !`, flags: [MessageFlags.Ephemeral]}];
        }
        cooldown.set(`${cmd.name}${interaction.user.id}`, Date.now() + cmd.cooldown);
        setTimeout(() => {
            cooldown.delete(`${cmd.name}${interaction.user.id}`);
        }, cmd.cooldown);
    }
    if (cmd.isCommandeGroupe) {
        const subCmdName = interaction.options.getSubcommand();
        for (const subCmd of cmd.options) {
            if (subCmd.name !== subCmdName) continue;
            //Vérifie si l'utilisateur est owner en cas de commande dev only
            if (subCmd.devOnly && !client.config.dev.includes(interaction.user.id)) {
                return [false, {content: ":tools: Commande en développement !", flags: [MessageFlags.Ephemeral]}];
            }
            return [true, subCmd.runInteraction];
        }
    }
    return [true, cmd.runInteraction];
};