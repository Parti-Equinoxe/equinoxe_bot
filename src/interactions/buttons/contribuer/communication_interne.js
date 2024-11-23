const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "communication_interne",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.communication_interne);
    }
}