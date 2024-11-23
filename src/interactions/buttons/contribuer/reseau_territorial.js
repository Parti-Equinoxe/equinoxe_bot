const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "reseau_territorial",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.reseau_territorial);
    }
}