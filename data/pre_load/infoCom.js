const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ChatInputCommandInteraction, parseEmoji, AttachmentBuilder
} = require("discord.js");
const {readFileSync} = require("fs");
const {banniere, couleurs, roles} = require("../../api/permanent.js");

const rolesNotif = [
    {
        roleID: "com_rs",
        emoji: "📱",
    },
    {
        roleID: "com_gl",
        emoji: "🔗",
    },
    {
        roleID: "equipe_site_internet",
        emoji: "📒",
    },
    {
        roleID: "relecteur",
        emoji: "✅",
    },
];
const nbPerRow = 2;

/**
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports.send = async (interaction) => {
    const info = new AttachmentBuilder('./data/images/information.png', {name: 'information.png'});
    const texte = readFileSync("./data/textes/infoCom.txt", "utf-8");
    //console.log(texte);
    return {
        embeds: [new EmbedBuilder()
            .setDescription(texte)
            .setColor(couleurs.jaune)
            .setThumbnail(banniere.link)
            .setImage(`attachment://information.png`)
            /*.addFields([{
                name: ":mobile_phone: Réseaux sociaux :",
                value: "- Créer des posts pour faire connaitre Équinoxe, informer et partager.\n- Animer en répondant au commentaires."
            },{
                name: "## :email: Mails :",
                value: "- Aider les groupes locaux à communiquer avec leurs membres.\n- Rédiger des mails d'informations."
            },{
                name: "# :flags: Création de contenu :",
                value: "- Créer le contenu partager sur les platformes.\n- Créer les affiches et les tracts pour les campagnes.\n- Monter les vidéos et les podcasts."
            }])*/
            .setFooter({text: "Cliquez sur les boutons ci-dessous pour vous ajouter/retirer des roles."})],
        files: [banniere.file(), info],
        components: actionRaw(rolesNotif, interaction)
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