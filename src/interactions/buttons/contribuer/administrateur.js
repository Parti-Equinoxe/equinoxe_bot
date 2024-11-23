const {roles} = require("../../../api/permanent.js");
module.exports = {
    customID: "administrateur",
    runInteraction: async (client, interaction) => {
        return interaction.reply({
            content: `Pour rejoindre cette équipe, contactez <@&${roles.responsable_discord}>.`,
            ephemeral: true
        });
    }
}