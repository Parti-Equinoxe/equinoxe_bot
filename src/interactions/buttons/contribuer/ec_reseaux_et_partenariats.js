const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "ec_reseaux_et_partenariats",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.ec_reseaux_et_partenariats);
    }
}