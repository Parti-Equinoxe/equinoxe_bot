const {rolereact} = require("../../../api/role.js");
const roles = require("../../../data/utils/roles.json");
module.exports = {
    customID: "blog_actu",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.blog_actu);
    }
}