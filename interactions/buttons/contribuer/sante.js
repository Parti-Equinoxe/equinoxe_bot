const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "sante",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.sante);
    }
}