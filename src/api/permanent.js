const { AttachmentBuilder } = require("discord.js");
module.exports.banniere = {
    link: `attachment://equinoxe_banner.png`,
    file: () => new AttachmentBuilder('./data/images/equinoxe_banner_hight.png', {name: 'equinoxe_banner.png'})
}
/**
 * @return {Object<`#${string}`>}
 */
module.exports.couleurs = require("../data/utils/colors.json");