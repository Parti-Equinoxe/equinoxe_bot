const {rolereact} = require("../../../api/role.js");
const {roles} = require("../../../api/permanent.js");
module.exports = {
    customID: "equipe_monteur",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.equipe_monteur);
    }
}