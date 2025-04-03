const { MessageFlags } = require("discord.js");
const { rolereact } = require("../../../api/role.js");

module.exports = {
    customID: "give_role",
    runInteraction: async (_, interaction, arguments) => {
        if (arguments.length == 0) {
            console.warn("Le bouton n'est pas encore configuré !");
            return interaction.reply({
                content: `Ce boutton n'est pas encore configuré !`,
                flags: [MessageFlags.Ephemeral]
            });
        }
        return rolereact(interaction, arguments[0]).catch((e) => {
            console.error(e);
            interaction.reply({
                content: `Une erreur est survenue lors de l'ajout du role : ${e.message}`,
                flags: [MessageFlags.Ephemeral]
            });
        });
    }
}