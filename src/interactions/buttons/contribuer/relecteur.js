const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "relecteur",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.relecteur);
    }
}