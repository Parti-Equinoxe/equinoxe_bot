const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "ec_administratif_et_finances",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.ec_administratif_et_finances);
    }
}