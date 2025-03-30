const {MessageFlags} = require("discord.js");
const {log} = require("../../../api/utils");
const {majPermInvite} = require("../../../api/role");
const {roles} = require("../../../api/permanent");
module.exports = {
    name: "invite",
    description: "Permet d'appliquer les permission de adherent au role invité.",
    subCommande: true,
    options: [
        {
            name: "salon",
            description: "Le salon dont vous voulez maj les permissions.",
            type: 7,
            required: true
        }
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        const channel = interaction.options.getChannel("salon");
        try {
            await majPermInvite(channel.id);
        } catch (e) {
            console.log(e);
            return interaction.reply({
                content: `:no_entry_sign: Je n'ai pas les permissions de modifier ce salon.`,
                flags: [MessageFlags.Ephemeral]
            });
        }
        await log(`Les permissions de <@&${roles.adherent}> ont on été appliquées au role <@&${roles.invite}> dans le salon <#${channel.id}>.`, "Maj de permission :", interaction.member, "warning");
        return interaction.reply({
            content: `:white_check_mark: Les permissions de <@&${roles.adherent}> ont on été appliquées au role <@&${roles.invite}> dans le salon <#${channel.id}> !`,
            flags: [MessageFlags.Ephemeral]
        });
    },
}