const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "secretaire_regional",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.secretaire_regional);
    }
}