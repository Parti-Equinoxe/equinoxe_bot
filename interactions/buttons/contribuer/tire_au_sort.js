const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "tire_au_sort",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.tire_au_sort);
    }
}