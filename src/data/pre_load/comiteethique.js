const {
    EmbedBuilder,
    ChatInputCommandInteraction, AttachmentBuilder
} = require("discord.js");
const {banniere, couleurs} = require("../../api/permanent.js");
/**
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports.send = async (interaction) => {
    const info = new AttachmentBuilder('./data/images/information.png', {name: 'info.png'});
    return {
        embeds: [
            new EmbedBuilder()
                .setDescription("# Le <@&1307780177702551736> :\n> Le comité d’éthique est chargé de garantir **un environnement respectueux et inclusif** au sein d’Équinoxe.\n\nSi vous rencontrez un problème avec un adhérent ou une situation inconfortable, n’hésitez pas à les contacter :\n### `comite-ethique@parti-equinoxe.fr`\nVous pouvez aussi aller leur poser des questions sur Discord : <#1309909796883005590>.")
                .setColor(couleurs.jaune)
                .setThumbnail(banniere.link)
                .setImage(`attachment://info.png`)
        ],
        files: [banniere.file(), info]
    };
}