const {rolereact} = require("../../../api/role.js");
const {roles} = require("../../../api/permanent.js");

module.exports = {
    customID: "communication",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.communication);
    }
}