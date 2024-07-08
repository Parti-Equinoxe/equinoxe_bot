const {AttachmentBuilder} = require("discord.js");
const roles = require("../data/utils/roles.json");
const salons = require("../data/utils/salons.json");
module.exports.banniere = {
    link: `attachment://equinoxe_banner.png`,
    file: () => new AttachmentBuilder('./data/images/equinoxe_banner_hight.png', {name: 'equinoxe_banner.png'})
}
/**
 * @return {`#${string}`}
 */
module.exports.jaune = "#ffd412";
/**
 * @return {`#${string}`}
 */
module.exports.noir = "#19171CFF"

module.exports.roles = roles;
module.exports.salons = salons;