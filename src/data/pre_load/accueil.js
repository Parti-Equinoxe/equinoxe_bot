const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ChatInputCommandInteraction, AttachmentBuilder
} = require("discord.js");
const {banniere, couleurs} = require("../../api/permanent.js");
const {roles, salons} = require("../../api/permanent");
/**
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports.send = async (interaction) => {
    const info = new AttachmentBuilder('./data/images/information.png', {name: 'info.png'});
    const relgemement = new AttachmentBuilder('./data/images/reglement.png', {name: 'reglement.png'});

    return {
        embeds: [
            new EmbedBuilder()
                .setDescription("# __Bienvenue sur le discord du parti :__\nIci vous trouverez l'essentiel des informations pour vous lancer dans l'action avec nous.")
                .setColor(couleurs.jaune)
                .setThumbnail(banniere.link)
                .setImage(`attachment://info.png`)
                .addFields({
                    name: "➡️ Les infos principales :",
                    value: "- La réunion d'accueil des nouveaux sur Zoom, [le premier dimanche de chaque mois à 19h00](https://us02web.zoom.us/j/87353318442?pwd=44HcaChnQkd2zNIaSgZ6Nw4X40jHf9.1) et [le troisième mercredi de chaque mois à 12h30](https://us02web.zoom.us/j/86436461575?pwd=aE2B5noC6QyP6S7qgM9GVI5MbFtaQP.1)\n- Le [guide du nouvel adhérent](https://docs.google.com/presentation/d/1j0sXELn29E4ZOxRoWZqe9m8kN_WpWdZ-gqxeKEF3s-0/edit?usp=drive_link) vous présente **l’architecture** et **l’organisation** du parti.\n"
                }, {
                    name: "🔧 Outils de travail :",
                    value: "- Ce discord comme espace de **travail** et de **communication** (si vous avez des difficultés pour l’utiliser, voici un mode d’emploi : [Guide Discord](https://support.discord.com/hc/fr/articles/360045138571-Guide-de-Discord-pour-débutants)\n- Un [**google drive**](https://drive.google.com/drive/folders/167Sjn4wedQJ1B_ToBAQjoSsPlnnUCC7G?usp=sharinf) pour stocker nos documents (*accessible à tous les adhérents*)\n- Retrouvez toute la documentation du parti sur le [Wikinoxe](https://membres.parti-equinoxe.fr/mon-compte/).\n"
                }, {
                    name: "🔑 Accès :",
                    value: "- Vous avez accès aux dossiers drive.\n- Pour accéder à d'autres canaux discord (<#867892299346477077>) : <#1206261702606463026>.\n- Pour rejoindre votre groupe what's app local : <#1276190973105410101>.\n"
                }, {
                    name: "❓Besoin d'aide ?",
                    value: "- Si vous avez besoin d'aide n'hésitez pas à créer un post ici : <#1249732581872767057>.\n"
                }),
            new EmbedBuilder()
                .setDescription("# __Règles de bonne conduite sur le discord :__")
                .setColor(couleurs.jaune)
                .setThumbnail(banniere.link)
                .setImage(`attachment://reglement.png`)
                .addFields({
                    name: "Pensez à vous renommer : <Prénom> <Nom> et à vous présenter :",
                    value: "- Cela permet **une meilleure intégration** ainsi qu'__une plus grande transparence__. De plus autant __assumer vos avis__. *Vous pouvez utiliser le bouton ci-dessous pour vous renommer.*\n- <#862077093226610688> pour vous présenter.\n"
                }, {
                    name: "Ni insulte, ni attaque personnelle :",
                    value: "- On discute des **idées** et __non des personnes__.\n- On peut **déconstruire des arguments** ou **proposer des contre-arguments** __sans s'attaquer aux personnes__ les proposant.\n- Ainsi, **les insultes** ou **attaques personnelles** ne sont pas tolérées, *la modération veille au grain !*\n"
                }, {
                    name: "Pas de tag / ping (@.......) inutile :",
                    value: "- Le discord peut être __un endroit très bruyant__, alors n'en rajoutons pas en taggant **inutilement** __les rôles__ ou __les personnes__.\n- Utilisez **les réactions** pour éviter __des messages de validation inutiles__."
                }, {
                    name: "Sobriété dans les messages et usage des canaux appropriés :",
                    value: "- Dans la mesure du possible, essayons de ne poster qu'**un message à la fois** afin d'éviter les malentendus à cause __de messages partiels__\n- Le **découpage en plusieurs paragraphes** permet néanmoins des __réponses plus ciblées__.\n- Les différents __canaux et catégories__ du discord faisant référence à des **sujets spécifiques**, __respectons l'organisation des salons__ (*Il y a une description en haut de la page)*.\n- Pas de petites annonces (emploi, stage, etc.)"
                }, {
                    name: "Ni violence, ni discrimination, ni offense :",
                    value: "- __Certaines publications__ peuvent ne pas être acceptées si elles sont **discriminatoires**, **offensantes** ou si elles sont **susceptibles de choquer** (*violence explicite, blague de mauvais goût, etc*).\n- Les salons <#1023829177004199966> et <#1249829979328348230> existent.\n"
                }),
            new EmbedBuilder()
                .setDescription(`# __Comment relier votre compte discord à l'Espace Membre ?__\n1. Vous devez être [adhérent(e)](https://membres.parti-equinoxe.fr/soutien/adhesion/) pour pouvoir accéder au **serveur discord** (et à l'Espace Membre).\n2. Allez sur l'[Espace Membre](https://membres.parti-equinoxe.fr/mon-compte/) et cliquez sur le bouton \"**Lier mon compte discord**\")\n3. Connectez-vous à votre compte discord (*celui présent sur le serveur*).\n4. Sur discord, cliquez sur le nom du serveur, puis \"**Rôles liés**\", puis **Adhérent(e)**.\n\n Si vous rencontrez des problèmes vous pouvez nous contacter sur https://discord.com/channels/861570273400717313/1249732581872767057`)
                .setColor(couleurs.jaune)
                .setThumbnail(banniere.link)
                .setFooter({text:"L'équipe de Modération"}),
        ],
        components: [new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("accueil:formulaire")
                .setEmoji("📝")
                .setLabel("Se renommer")
                .setStyle(1)
        )],
        files: [banniere.file(), info, relgemement]
    };
}