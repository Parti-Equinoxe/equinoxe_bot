const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ChatInputCommandInteraction, parseEmoji, AttachmentBuilder
} = require("discord.js");
const {banniere, couleurs, roles} = require("../../api/permanent.js");

const rolesNotif = [
    {
        roleID: "international",
        emoji: "🌍",
        description: "Équipe responsable de gérer LinkedIn."
    },
    {
        roleID: "numerique",
        emoji: "🖥️",
        description: "Équipe responsable de gérer Instagram."
    },
    {
        roleID: "agriculture_environement",
        emoji: "🌾",
        description: "Équipe responsable de gérer Facebook."
    },
    {
        roleID: "social",
        emoji: "👫",
        description: "Équipe responsable de gérer Twitter."
    },
    {
        roleID: "economie",
        emoji: "💰",
        description: "Équipe responsable de gérer TikTok."
    },
    {
        roleID: "sante",
        emoji: "🫀",
        description: "Équipe responsable de gérer YouTube."
    },
    {
        roleID: "energie",
        emoji: "⚡",
        description: "Équipe responsable de gérer le site internet."
    },
    {
        roleID: "democratie",
        emoji: "🗽",
        description: "Équipe responsable de gérer le site internet."
    },
    {
        roleID: "cohesion",
        emoji: "🤝",
        description: "Équipe responsable de gérer le site internet."
    },
    {
        roleID: "education",
        emoji: "📖",
        description: "Équipe responsable de gérer le site internet."
    },
    {
        roleID: "transport",
        emoji: "🚅",
        description: "Équipe responsable de gérer le site internet."
    }
    ,
    {
        roleID: "logement",
        emoji: "🏘️",
        description: "Équipe responsable de gérer le site internet."
    }
];
const nbPerRow = 3;

/**
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports.send = async (interaction) => {
    console.log(rolesNotif.map((role) => `- ${role.emoji}・<@&${roles[role.roleID]}> : ${role.description}`).join("\n").length);
    const contri = new AttachmentBuilder('./data/images/contribuer.png', {name: 'contribuer.png'});
    return {
        embeds: [new EmbedBuilder()
            .setDescription(`# __Contribuez en rejoignant nos équipes réseaux sociaux :__\nPour gérer la publication et l'interaction avec les communautés sur nos différentes plateformes.\nUtilisez les boutons ci-dessous pour rejoindre une équipe.\nResponsables : <@&${roles.referent_com_rs}> et <@&${roles.referent_com_gl}>.`)
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
            console.log(role);
            return new ButtonBuilder()
                .setCustomId(`contribuer:${role.roleID}`)
                .setEmoji(parseEmoji(role.emoji))
                .setLabel(interaction.guild.roles.cache.get(roles[role.roleID]).name)
                .setStyle(2);
        })));
    }
    return tab;
}