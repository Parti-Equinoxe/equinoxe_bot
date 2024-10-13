const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "organisation_du_secretariat",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.organisation_du_secretariat);
    }
}