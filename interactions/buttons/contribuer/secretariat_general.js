const {rolereact} = require("../../../api/role.js");
const roles = require("../../../data/utils/roles.json");
module.exports = {
    customID: "scecretariat_general",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.secretariat_general);
    }
}