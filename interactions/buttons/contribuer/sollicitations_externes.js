const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "sollicitations_externes",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.sollicitations_externes);
    }
}