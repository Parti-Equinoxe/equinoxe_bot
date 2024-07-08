const {rolereact} = require("../../../api/role.js");
const {roles} = require("../../../api/permanent.js");
module.exports = {
    customID: "blog_actu",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.blog_actu);
    }
}