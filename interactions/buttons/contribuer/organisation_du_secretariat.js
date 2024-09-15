const {rolereact} = require("../../../api/role.js");
const {roles} = require("../../../api/permanent.js");
module.exports = {
    customID: "organisation_du_secretariat",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.organisation_du_secretariat);
    }
}