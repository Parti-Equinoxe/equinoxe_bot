const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ChatInputCommandInteraction, AttachmentBuilder
} = require("discord.js");
const {banniere, couleurs} = require("../../api/permanent.js");
/**
 * @param {ChatInputCommandInteraction} interaction
 */
module.exports.send = async (interaction) => {
    const info = new AttachmentBuilder('./data/images/cellule_decoute.png', {name: 'cde.png'});

    return {
        embeds: [
            //.setFooter({text: ""}),
            new EmbedBuilder()
                .setDescription("# __Cellule d'écoute :__\n- Si vous êtes victime de comportements inappropriés.\n- Si vous êtes témoin de comportements inappropriés.\n### Vous pouvez contacter <@1255487701109706816> ou le \`06 71 42 93 63\`, l'anonymat sera respecté.")
                .setColor(couleurs.jaune)
                .setThumbnail(banniere.link)
                .setImage(`attachment://cde.png`)
            //.setFooter({text: ""})
        ],
        files: [banniere.file(), info]
    };
}