const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "coordinateur_ce",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.coordinateur_ce);
    }
}