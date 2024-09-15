const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ChatInputCommandInteraction, parseEmoji, AttachmentBuilder
} = require("discord.js");
const {banniere, couleurs, roles} = require("../../api/permanent.js");

const rolesNotif = [
    {
        roleID: "communication_interne",
        emoji: "",
        description: "Pour s'occuper de la communication interne (mails, What's App, discord, etc).",
        refID: "referent_communication_interne"
    },
    {
        roleID: "outils_internes",
        emoji: "",
        description: "Pour s'occuper de la mise en place et la maintenance des outils numérique du parti, ainsi que la sécurité et le respect du RGPD.",
        refID: "referent_outils_internes"
    },
    {
        roleID: "accueil_des_adherents",
        emoji: "",
        description: "Pour s'occuper d'accueillir les nouveaux arrivants et s'occuper des guides.",
        refID: "referent_accueil_des_adherents"
    },
    {
        roleID: "evenementiel",
        emoji: "",
        description: "Pour gérer les évenements majeurs du parti et aider les GL pour l'organisation de leurs événements.",
        refID: "referent_evenementiel"
    },
    {
        roleID: "organisation_du_secretariat",
        emoji: "",
        description: "Pour s'occuper de l'organisation du scecrétariat.",
        refID: "referent_organisation_du_secretariat"
    },
    {
        roleID: "admin_site_internet",
        emoji: "",
        description: "Pour s'occuper de la maintenance et la sécurité du site internet (gestion des erreurs, mises à jour...).",
        refID: "referent_site_internet"
    },
    {
        roleID: "administrateur",
        emoji: "🤓",
        description: "Pour s'occuper de l'équipe de modération et plus largement du serveur discord.",
        refID: "responsable_discord"
    }
];
const nbPerRow = 3;

/**
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports.send = async (interaction) => {
    console.log(rolesNotif.map((role) => `- ${role.emoji}・<@&${roles[role.roleID]}> : ${role.description}`).join("\n").length);
    const contri = new AttachmentBuilder('./data/images/contribuer.png', {name: 'contribuer.png'});
    const texte = rolesNotif.map((role) => `### - ${role.emoji === "" ? "" : role.emoji+"・ "}<@&${roles[role.roleID]}>\n> ${role.description}\n> => <@&${roles[role.refID]}>`).join("\n")
    return {
        embeds: [new EmbedBuilder()
            .setDescription(`# __Contribuez en rejoignant une équipe du secrétariat général :__\nVenez aider sur les différents travaux interne, à l'organisation des évenements, à la communication interne, l'accueil des nouveaux arrivants et l'organisation du parti.\nUtilisez les boutons ci-dessous pour rejoindre une équipe.\n### __Liste des rôles :__\n${texte}`)
            .setColor(couleurs.jaune)
            .setThumbnail(banniere.link)
            .setImage(`attachment://contribuer.png`)
            //.addFields()
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
            console.log(`${role.roleID} => ${roles[role.roleID]}`)
            const btn =  new ButtonBuilder()
                .setCustomId(`contribuer:${role.roleID}`)
                .setLabel(interaction.guild.roles.cache.get(roles[role.roleID]).name)
                .setStyle(2);
            if (role.emoji !== "") btn.setEmoji(parseEmoji(role.emoji));
            return btn;
        })));
    }
    return tab;
}