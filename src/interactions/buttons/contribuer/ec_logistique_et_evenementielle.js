const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "ec_logistique_et_evenementielle",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.ec_logistique_et_evenementielle);
    }
}