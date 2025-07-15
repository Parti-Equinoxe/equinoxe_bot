const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ChatInputCommandInteraction, parseEmoji, AttachmentBuilder
} = require("discord.js");
const {banniere, couleurs, roles} = require("../../api/permanent.js");

const rolesNotif = [
    {
        roleID: "environement",
        emoji: "🌾",
        description: "> Agriculture & Alimentation\n> Forêts & milieux naturels\n> Pêche & Domaine Maritime\n> Biodiversité."
    },
    {
        roleID: "social",
        emoji: "🙆",
        description: "> Logement\n> Santé\n> Éducation\n> Culture"
    },
    {
        roleID: "economie",
        emoji: "💰",
        description: "> Système économique, monétaire et financier\n> Administrations & Finances Publiques\n> Entreprises\n> Travail & Emploi"
    },
    {
        roleID: "international",
        emoji: "🌍",
        description: "> Défense\n> Union européenne\n> Géopolitique & diplomatie\n> Flux migratoires"
    },
    {
        roleID: "technique",
        emoji: "🔧",
        description: "> Énergie\n> Numérique\n> Industrie\n> Transport"
    },
    {
        roleID: "democratie",
        emoji: "🗽",
        description: "> Institutions\n> Citoyenneté & Identité\n> Justice\n> Médias"
    },
    {
        roleID: "cohesion",
        emoji: "🤝",
        description: "> Sécurité & Appareil judiciaire\n> Immigration\n> Discriminations\n> Laïcité"
    }
];
const nbPerRow = 4;

/**
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports.send = async (interaction) => {
    console.log(rolesNotif.slice(0, nbPerRow).map((role) => `- ${role.emoji}・<@&${roles[role.roleID]}> : ${role.description}`).join("\n").length);
    console.log(rolesNotif.slice(nbPerRow, nbPerRow*2).map((role) => `- ${role.emoji}・<@&${roles[role.roleID]}> : ${role.description}`).join("\n").length);
    const contri = new AttachmentBuilder('./data/images/contribuer.png', {name: 'contribuer.png'});
    return {
        embeds: [new EmbedBuilder()
            .setDescription(`# __Contribuez en rejoignant les équipes thématiques :__\nPour aider à la création et au maintien du programme, par thème.\nUtilisez les boutons ci-dessous pour rejoindre une équipe.\nResponsables : <@&${roles.responsable_programme}>.\nVous pouvez trouvez qui sont les responsables de chaque thème dans les salons forums associé (post épinglé).`)
            .setColor(couleurs.jaune)
            .setThumbnail(banniere.link)
            .setImage(`attachment://contribuer.png`)
            .addFields({
                    name: "__Liste des rôles (domaines) :__",
                    value: rolesNotif./*slice(0, nbPerRow).*/map((role) => `- ${role.emoji}・<@&${roles[role.roleID]}> :\n${role.description}`).join("\n"),
                }/*,
                {
                    name: "** **",
                    value: rolesNotif.slice(nbPerRow, nbPerRow*2).map((role) => `- ${role.emoji}・<@&${roles[role.roleID]}> :\n${role.description}`).join("\n"),
                }*/)
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