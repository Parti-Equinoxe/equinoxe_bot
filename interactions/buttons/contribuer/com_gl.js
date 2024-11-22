const {roles} = require("../../../api/permanent.js");
const {rolereact} = require("../../../api/role.js");
module.exports = {
    customID: "com_gl",
    runInteraction: async (client, interaction) => {
        return rolereact(interaction, roles.com_gl);
    }
}