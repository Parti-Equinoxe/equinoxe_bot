const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "suppleant",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.suppleant);
    }
}