const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "blog_actu",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.blog_actu);
    }
}