const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "prof_formation",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.prof_formation);
    }
}