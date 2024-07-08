const {rolereact} = require("../../../api/role.js");
const {roles} = require("../../../api/permanent.js");
module.exports = {
    customID: "reseaux_partenariats",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.responsable_reseaux_et_partenariats);
    }
}