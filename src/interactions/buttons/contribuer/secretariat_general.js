const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "secretariat_general",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.secretariat_general);
    }
}