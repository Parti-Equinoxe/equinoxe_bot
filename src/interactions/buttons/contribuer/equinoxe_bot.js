const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "equinoxe_bot",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.equinoxe_bot);
    }
}