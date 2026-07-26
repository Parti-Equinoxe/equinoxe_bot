const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "ec_presse_et_veille",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.ec_presse_et_veille);
    }
}