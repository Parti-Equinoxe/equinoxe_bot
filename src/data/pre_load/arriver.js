const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ChatInputCommandInteraction, AttachmentBuilder
} = require("discord.js");
const {banniere, couleurs} = require("../../api/permanent.js");
const {salons} = require("../../api/permanent");

module.exports.send = async () => {
    const info = new AttachmentBuilder('./data/images/information.png', {name: 'info.png'});

    return {
        embeds: [
            new EmbedBuilder()
                .setDescription("# __Bienvenue sur le Discord d’Équinoxe ! :__\nNous sommes ravis de vous accueillir parmi nous.\nCe serveur Discord est un espace de travail collaboratif pour toutes les équipes opérationnelles d’Équinoxe.\nIl vous permettra de participer activement aux projets et aux discussions du parti.")
                .setColor(couleurs.jaune)
                .setThumbnail(banniere.link)
                .setImage(`attachment://info.png`)
                .addFields({
                    name: "Comment utiliser le Discord ? 💻",
                    value: `- Nouveau sur discord ? => [Viens voir ce tutoriel](https://www.youtube.com/watch?v=A11SwaLqKFA)\n- Dans **“Accueil Équinoxe”** commencez par lire <#${salons.a_lire_adherents}>.\n- C'est plus sympa si tu peux te renommer (si tu ne sais pas faire il y a un bouton !)`
                }, {
                    name: "Informations essentielles :",
                    value: `- Respectez la vie privée : Ne partagez jamais vos **adresses e-mail ou numéros de téléphone** dans les salons publics.\n- Protection des documents : Ne postez pas de liens Drive ou autres documents confidentiels dans les salons publics.\n- Si tu as besoin d'aide <#${salons.aide_questions}>`
                }, {
                    name: "Participer à une Réunion d’accueil 🤝",
                    value: "- Les [réunions d’accueil](https://us02web.zoom.us/j/86054314608?pwd=RnFqRFVEbHRXaVVkR0V1dEFCRHhtUT09) des nouveaux adhérents et sympathisants se déroulent :\n - Le premier dimanche de chaque mois à 19h00\n - Le troisième mercredi de chaque mois à 12h30"
                }, {
                    name: "Ressources importantes 🔗",
                    value: "- [Manifeste du parti](https://drive.google.com/file/d/1vgSE_hrin1K2FYVhMIPSl4Vs6StKerv8/view?usp=drive_link)\n- [Les podcasts d'Équinoxe](https://parti-equinoxe.fr/nos-podcasts/)\n- Tu es sur ta boucle WhatsApp ? https://discord.com/channels/861570273400717313/1276190973105410101"
                })
                .setFooter({text: "Tu peux utiliser le bouton si dessous pour te renommer"})
                .setAuthor({name: "🌓 L’équipe Équinoxe"})
        ],
        components: [new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("accueil:formulaire")
                .setEmoji("📝")
                .setLabel("Se renommer")
                .setStyle(1)
        )],
        files: [banniere.file(), info]
    };
}