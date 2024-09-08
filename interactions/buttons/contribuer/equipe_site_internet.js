const {rolereact} = require("../../../api/role.js");
const {roles} = require("../../../api/permanent.js");
module.exports = {
    customID: "equipe_site_internet",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.equipe_site_internet);
    }
}