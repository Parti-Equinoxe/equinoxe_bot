const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "equipe_linkedin",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.equipe_linkedin);
    }
}