const {rolereact} = require("../../../api/role.js");
const {roles} = require("../../../api/permanent.js");
module.exports = {
    customID: "equipe_facebook",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.equipe_facebook);
    }
}