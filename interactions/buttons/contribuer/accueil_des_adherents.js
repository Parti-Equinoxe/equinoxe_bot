const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "accueil_des_adherents",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.accueil_des_adherents);
    }
}