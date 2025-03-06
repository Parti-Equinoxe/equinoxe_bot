const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ChatInputCommandInteraction, parseEmoji, AttachmentBuilder
} = require("discord.js");
const {banniere, couleurs, roles} = require("../../api/permanent.js");

const rolesNotif = [
    {
        roleID: "prog_formation",
        emoji: "📖",
        description: "S'occupe d'apporter du contenu de formation (lectures, conférences, podcasts…) aux équipes du programme ainsi que pour former les adhérents sur le programme."
    },
    {
        roleID: "prog_processus",
        emoji: "⚙️",
        description: "S'occupe de préparer/fournir des outils et méthodes pour aider les équipes thématiques."
    },
    {
        roleID: "prog_diffusion",
        emoji: "📡",
        description: "S'occupe de créer les articles sur le programme pour l'équipe de communication."
    }
];
//@TODO : rajouter roles dans /contribuer
const nbPerRow = 2;

/**
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports.send = async (interaction) => {
    console.log(rolesNotif.map((role) => `- ${role.emoji}・<@&${roles[role.roleID]}> : ${role.description}`).join("\n").length);
    const contri = new AttachmentBuilder('./data/images/contribuer.png', {name: 'contribuer.png'});
    return {
        embeds: [new EmbedBuilder()
            .setDescription(`# __Contribuez en rejoignant nos équipes transversales du pôle programme :__\nPour gérer la communication, les formations ou les outils et méthodes utilisés par les équipes thématiques ainsi que le reste du pôle programme.\nUtilisez les boutons ci-dessous pour rejoindre une équipe.\nResponsables : <@&${roles.responsable_programme}>.`)
            .setColor(couleurs.jaune)
            .setThumbnail(banniere.link)
            .setImage(`attachment://contribuer.png`)
            .addFields({
                name: "__Liste des rôles :__",
                value: rolesNotif.map((role) => `- ${role.emoji}・<@&${roles[role.roleID]}> : ${role.description}`).join("\n"),
            })
            .setFooter({text: "Cliquez sur les boutons ci-dessous pour vous ajouter/retirer des roles."})],
        components: actionRaw(rolesNotif, interaction),
        files: [banniere.file(), contri]
    };
}

function actionRaw(rolesNotif, interaction) {
    const tab = [];
    const raws = Math.min(Math.ceil(rolesNotif.length / nbPerRow), 5);
    for (let index = 0; index < raws; index++) {
        tab.push(new ActionRowBuilder().addComponents(rolesNotif.slice(nbPerRow * index, nbPerRow * (index + 1)).map((role) => {
            return new ButtonBuilder()
                .setCustomId(`contribuer:${role.roleID}`)
                .setEmoji(parseEmoji(role.emoji))
                .setLabel(interaction.guild.roles.cache.get(roles[role.roleID]).name)
                .setStyle(2);
        })));
    }
    return tab;
}