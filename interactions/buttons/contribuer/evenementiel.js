const {rolereact} = require("../../../api/role.js");
const {roles} = require("../../../api/permanent.js");
module.exports = {
    customID: "evenementiel",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.evenementiel);
    }
}