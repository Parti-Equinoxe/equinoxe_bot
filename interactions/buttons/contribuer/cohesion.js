const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "cohesion",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.cohesion);
    }
}