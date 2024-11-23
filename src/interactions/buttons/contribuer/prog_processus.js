const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "prog_processus",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.prog_processus);
    }
}