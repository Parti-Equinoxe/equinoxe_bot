const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "equipe_audio",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.equipe_audio);
    }
}