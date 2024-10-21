const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ChatInputCommandInteraction, parseEmoji, AttachmentBuilder
} = require("discord.js");
const {banniere, couleurs, roles} = require("../../api/permanent.js");
const {salons} = require("../../api/permanent");

const rolesNotif = [
    {
        roleID: "programme",
        emoji: "📒",
        description: `Pour contribuer à la création du programme. Passez dans <#${salons.info_programme}> pour voir les informations sur le pôle et choisir vos thèmes.`
    },
    {
        roleID: "blog_actu",
        emoji: "✍",
        description: "Pour contribuer à la rédaction d'articles sur l'actualité."
    },
    {
        roleID: "secretariat_general",
        emoji: "🔶",
        description: "Pour contribuer à l'organisation d'événements, à la communication interne et administrative."
    },
    {
        roleID: "communication",
        emoji: "📡",
        description: "Pour contribuer à la stratégie de communication, à la gestion des relations avec la presse ou à la création et rédaction de posts pour les réseaux sociaux, le site internet et les mails."
    },
    {
        roleID: "mobilisation",
        emoji: "👉",
        description: "Pour contribuer à l'organisation et la formation des militants."
    },
    {
        roleID: "relecteur",
        emoji: "✅",
        description: "Pour contribuer à la relecture et à la corrections des posts et articles."
    },
    {
        roleID: "reseaux_partenariats",
        emoji: "🤝",
        description: "Pour contribuer à faire connaître Équinoxe auprès de personnalités ciblées : influenceurs, scientifiques, mécènes. Gestion des contacts avec différents partis politiques et associations."
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
            .setDescription("# __Contribuez en rejoignant nos équipes opérationnelles :__\nCi-dessous vous trouverez une présentation des différentes équipes accompagnée de postes sur lesquels nous avons besoin de force vive (liste non exhaustive).\nSi vous pensez pouvoir nous aider (*même un peu*) sur l'un de ces sujets. Utilisez les boutons ci-dessous.")
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