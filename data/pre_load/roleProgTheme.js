const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ChatInputCommandInteraction, parseEmoji, AttachmentBuilder
} = require("discord.js");
const {banniere, couleurs, roles} = require("../../api/permanent.js");

const rolesNotif = [
    {
        roleID: "agriculture_environement",
        emoji: "🌾",
        description: "Équipe responsable portant sur l’agriculture, l’alimentation, l’environnement, la mer, les forêts, la biodiversité."
    },
    {
        roleID: "social",
        emoji: "👫",
        description: "Équipe responsable portant sur es questions sociales et sociétales: droits animaux et humains, égalité homme-femme, discriminations, personnes âgées, retraites, handicap, culture, sport, enfance, famille."
    },
    {
        roleID: "sante",
        emoji: "🫀",
        description: "Équipe responsable portant sur les questions de santé, de ses acteurs, de ses infrastructures, de l'accès au système de santé ainsi que de son organisation."
    },
    {
        roleID: "economie",
        emoji: "💰",
        description: "Équipe responsable portant sur les questions économiques, la fiscalité, le travail, le commerce extérieur, le tourisme, l’industrie, ainsi que les questions d'inégalités économiques."
    },
    {
        roleID: "international",
        emoji: "🌍",
        description: "Équipe responsable portant sur les relations, coopérations et politiques internationales et européennes, et sur la défense."
    },
    {
        roleID: "numerique",
        emoji: "🖥️",
        description: "Équipe responsable portant sur le numérique et l’intelligence artificielle: risques et opportunités, impact sociétal et environnemental, règlementations, transformation numérique de la fonction publique, inégalité numérique."
    },
    {
        roleID: "energie",
        emoji: "⚡",
        description: "Équipe responsable portant sur les modalités de production, de stockage, de transport et de consommation de l'énergie."
    },
    {
        roleID: "democratie",
        emoji: "🗽",
        description: "Équipe responsable portant sur les questions de gouvernance et de démocratie, le renouveau démocratique, les modalités d’élection, le référendum, les conventions citoyennes."
    },
    {
        roleID: "cohesion",//securite-justice
        emoji: "🤝",
        description: "Équipe responsable portant sur la sécurité intérieure, la justice, l'immigration, le droit d’asile."
    },
    {
        roleID: "education",
        emoji: "📖",
        description: "Équipe responsable portant sur l'éducation, l'enseignement supérieur, la recherche et la formation tout au long de la vie."
    },
    {
        roleID: "transport",
        emoji: "🚅",
        description: "Équipe responsable portant sur les modalités, les équipements, les infrastructures de transport et de mobilité."
    }
    ,
    {
        roleID: "logement",
        emoji: "🏘️",
        description: "Équipe responsable portant sur ’accès au logement, la rénovation énergétique, l’urbanisme et l’aménagement du territoire (en lien avec transport, économie, environnement)."
    }
];
const nbPerRow = 3;

/**
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports.send = async (interaction) => {
    console.log(rolesNotif.slice(0, 4).map((role) => `- ${role.emoji}・<@&${roles[role.roleID]}> : ${role.description}`).join("\n").length);
    console.log(rolesNotif.slice(4, 7).map((role) => `- ${role.emoji}・<@&${roles[role.roleID]}> : ${role.description}`).join("\n").length);
    console.log(rolesNotif.slice(7, 12).map((role) => `- ${role.emoji}・<@&${roles[role.roleID]}> : ${role.description}`).join("\n").length);
    const contri = new AttachmentBuilder('./data/images/contribuer.png', {name: 'contribuer.png'});
    return {
        embeds: [new EmbedBuilder()
            .setDescription(`# __Contribuez en rejoignant les équipes thématiques :__\nPour aider à la création et au maintient du programme, par thème.\nUtilisez les boutons ci-dessous pour rejoindre une équipe.\nResponsables : <@&${roles.responsable_programme}>, <@&${roles.coordination_programme}> et les responsables thématiques.`)
            .setColor(couleurs.jaune)
            .setThumbnail(banniere.link)
            .setImage(`attachment://contribuer.png`)
            .addFields({
                    name: "__Liste des rôles :__",
                    value: rolesNotif.slice(0, 4).map((role) => `- ${role.emoji}・<@&${roles[role.roleID]}> : ${role.description}`).join("\n"),
                },
                {
                    name: "** **",
                    value: rolesNotif.slice(4, 7).map((role) => `- ${role.emoji}・<@&${roles[role.roleID]}> : ${role.description}`).join("\n"),
                },
                {
                    name: "** **",
                    value: rolesNotif.slice(7, 12).map((role) => `- ${role.emoji}・<@&${roles[role.roleID]}> : ${role.description}`).join("\n"),
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