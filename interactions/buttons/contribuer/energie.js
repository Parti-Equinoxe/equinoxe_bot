const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "energie",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.energie);
    }
}