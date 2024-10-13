const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "reseaux_partenariats",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.reseaux_partenariats);
    }
}