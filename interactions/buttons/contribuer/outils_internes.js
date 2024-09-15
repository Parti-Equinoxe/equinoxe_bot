const {rolereact} = require("../../../api/role.js");
const {roles} = require("../../../api/permanent.js");
module.exports = {
    customID: "outils_internes",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.outils_internes);
    }
}