const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ChatInputCommandInteraction, parseEmoji
} = require("discord.js");
const roles = require("../utils/roles.json");

const rolesNotif = [
    {
        roleID: "programme",
        emoji: "📒",
        description: "Pour contribuer à la création du programme."
    },
    {
        roleID: "blog_actu",
        emoji: "✍",
        description: "Pour contribuer à la rédaction d'articles sur l'actualité publiés sur le site internet."
    },
    {
        roleID: "secretariat_general",
        emoji: "🔶",
        description: "Pour contribuer à l'organisation d'événements, à la communication interne et administrative."
    },
    {
        roleID: "communication",
        emoji: "📡",
        description: "Pour contribuer à la stratégie de communication, réseaux sociaux, site internet ou à la gestion des relations avec la presse."
    },
    {
        roleID: "mobilisation",
        emoji: "👉",
        description: "Pour contribuer àl 'organisation et la formation des militants."
    },
    {
        roleID: "reseaux_partenariats",
        emoji: "🤝",
        description: "Pour contribuer à faire connaître Équinoxe auprès de personnalités ciblées : influenceurs, scientifiques, mécènes. Gestion des contacts avec différents partis politiques et associations."
    }
];

/**
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports.send = async (interaction) => {
    console.log(rolesNotif.map((role) => `- ${role.emoji}・<@&${roles[role.roleID]}> : ${role.description}`).join("\n").length);
    return {
        embeds: [new EmbedBuilder()
            .setTitle("__Contribuez en rejoignant nos équipes opérationnelles :__")
            .setDescription("Ci-dessous vous trouverez une présentation des différentes équipes accompagnée de postes sur lesquels nous avons besoin de force vive (liste non exhaustive).\nSi vous pensez pouvoir nous aider (même un peu) sur l'un de ces sujets. Utilisez les boutons ci-dessous.")
            .setColor("#ffd412")
            .addFields({
                name: "__Liste des rôles :__",
                value: rolesNotif.map((role) => `- ${role.emoji}・<@&${roles[role.roleID]}> : ${role.description}`).join("\n"),
            })
            //.setAuthor(await api.utils.staffFRG())
            .setFooter({text: "Cliquez sur les boutons ci-dessous pour vous ajouter/retirer les roles."})],
        components: [new ActionRowBuilder().addComponents(rolesNotif.slice(0, 4).map((role) => {
            return new ButtonBuilder()
                .setCustomId(`contribuer:${role.roleID}`)
                .setEmoji(parseEmoji(role.emoji))
                .setLabel(interaction.guild.roles.cache.get(roles[role.roleID]).name)
                .setStyle(2);
        })), new ActionRowBuilder().addComponents(rolesNotif.slice(4, 8).map((role) => {
            return new ButtonBuilder()
                .setCustomId(`contribuer:${role.roleID}`)
                .setEmoji(parseEmoji(role.emoji))
                .setLabel(interaction.guild.roles.cache.get(roles[role.roleID]).name)
                .setStyle(2);
        }))]
    };
}