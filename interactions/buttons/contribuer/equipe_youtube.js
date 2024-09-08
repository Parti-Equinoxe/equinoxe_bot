const {rolereact} = require("../../../api/role.js");
const {roles} = require("../../../api/permanent.js");
module.exports = {
    customID: "equipe_youtube",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.equipe_youtube);
    }
}