const {rolereact} = require("../../../api/role.js");
const {roles} = require("../../../api/permanent.js");
module.exports = {
    customID: "secretariat_general",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.secretariat_general);
    }
}