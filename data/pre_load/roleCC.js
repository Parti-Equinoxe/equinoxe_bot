const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ChatInputCommandInteraction, parseEmoji, AttachmentBuilder
} = require("discord.js");
const {banniere, couleurs, roles} = require("../../api/permanent.js");

const rolesNotif = [
    {
        roleID: "equipe_redacteur",
        emoji: "📝",
        description: "Pour les spécialistes des lettres."
    },
    {
        roleID: "equipe_graphiste",
        emoji: "🌄",
        description: "Pour les spécialistes de canvas."
    },
    {
        roleID: "equipe_audio",
        emoji: "🎙",
        description: "Pour les spécialistes de l'audio et des podcasts."
    },
    {
        roleID: "equipe_monteur",
        emoji: "🖥",
        description: "Pour les spécialistes de la création et du montage de vidéo."
    },
];
const nbPerRow = 2;

/**
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports.send = async (interaction) => {
    console.log(rolesNotif.map((role) => `- ${role.emoji}・<@&${roles[role.roleID]}> : ${role.description}`).join("\n").length);
    const contri = new AttachmentBuilder('./data/images/contribuer.png', {name: 'contribuer.png'});
    return {
        embeds: [new EmbedBuilder()
            .setDescription(`# __Contribuez en rejoignant nos équipes de création de contenu :__\nPour participer à la création de contenu visuel, vidéo, audio (podcasts) ou rédactionnel, et à la création de templates pour anticiper les besoins des Groupes Locaux.\n*Contrairement à ce qui est marqué pas besoin d'être spécialistes :sweat_smile:.*\nUtilisez les boutons ci-dessous pour rejoindre une équipe.\nResponsable <@&${roles.referent_creation_contenu}>.`)
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