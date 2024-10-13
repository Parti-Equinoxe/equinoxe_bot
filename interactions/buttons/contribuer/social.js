const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "social",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.social);
    }
}