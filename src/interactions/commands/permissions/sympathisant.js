const { MessageFlags } = require("discord.js");
const { log } = require("../../../api/utils");
const { majPermSymp } = require("../../../api/role");
const {roles} = require("../../../api/permanent");
module.exports = {
    name: "sympathisant",
    description: "Permet d'appliquer les permission de @everyone au role sympathisant.",
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
            await majPermSymp(channel.id);
        } catch (e) {
            console.log(e);
            return interaction.reply({
                content: `:no_entry_sign: Je n'ai pas les permissions de modifier ce salon.`,
                flags: [MessageFlags.Ephemeral]
            });
        }
        const configAdherentRole = {};
        if (!client.configHandler.tryGet("adherentRole", configAdherentRole)) {
            return interaction.reply({
                content: `:no_entry_sign: Le rôle adhérent n'est pas configuré.`,
                flags: [MessageFlags.Ephemeral]
            });
        }
        await log(`Les permissions de @everyone ont on été appliquées au role <@&${roles.sympathisant}> dans le salon <#${channel.id}>.`, "Maj de permission :", interaction.member, "warning");
        return interaction.reply({
            content: `:white_check_mark: Les permissions de @everyone ont on été appliquées au role <@&${roles.sympathisant}> dans le salon <#${channel.id}> !`,
            flags: [MessageFlags.Ephemeral]
        });
    },
}