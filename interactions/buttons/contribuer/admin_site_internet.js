const {roles} = require("../../../api/permanent.js");
module.exports = {
    customID: "admin_site_internet",
    runInteraction: async (client, interaction) => {
        return interaction.reply({
            content: `Pour rejoindre cette équipe, contactez <@&${roles.referent_site_internet}>.`,
            ephemeral: true
        });
    }
}