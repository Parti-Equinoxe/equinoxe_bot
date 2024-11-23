const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "prog_formation",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.prog_formation);
    }
}