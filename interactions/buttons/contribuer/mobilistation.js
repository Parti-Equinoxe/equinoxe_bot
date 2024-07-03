const {rolereact} = require("../../../api/role.js");
const roles = require("../../../data/utils/roles.json");
module.exports = {
    customID: "mobilisation",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.mobilisation);
    }
}