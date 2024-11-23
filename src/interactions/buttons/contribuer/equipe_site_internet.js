const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "equipe_site_internet",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.equipe_site_internet);
    }
}