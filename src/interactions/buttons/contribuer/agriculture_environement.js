const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "agriculture_environement",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.agriculture_environement);
    }
}