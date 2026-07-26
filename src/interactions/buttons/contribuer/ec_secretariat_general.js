const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "ec_secretariat_general",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.ec_secretariat_general);
    }
}