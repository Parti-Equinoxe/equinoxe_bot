const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "booster",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.booster);
    }
}