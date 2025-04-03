const { MessageFlags } = require("discord.js");
const { log } = require("../../../api/utils");
const { majPermInvite } = require("../../../api/role");
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
        const configInviteRole = {};
        if (!client.configHandler.tryGet("inviteRole", configInviteRole)) {
            return interaction.reply({
                content: `:no_entry_sign: Le role invité n'est pas configuré.`,
                flags: [MessageFlags.Ephemeral]
            });
        }
        const configAdherentRole = {};
        if (!client.configHandler.tryGet("adherentRole", configAdherentRole)) {
            return interaction.reply({
                content: `:no_entry_sign: Le role adhérent n'est pas configuré.`,
                flags: [MessageFlags.Ephemeral]
            });
        }

        await log(`Les permissions de <@&${configAdherentRole.value}> ont on été appliquées au role <@&${configInviteRole.value}> dans le salon <#${channel.id}>.`, "Maj de permission :", interaction.member, "warning");
        return interaction.reply({
            content: `:white_check_mark: Les permissions de <@&${configAdherentRole.value}> ont on été appliquées au role <@&${configInviteRole.value}> dans le salon <#${channel.id}> !`,
            flags: [MessageFlags.Ephemeral]
        });
    },
}