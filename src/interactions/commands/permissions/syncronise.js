const {MessageFlags} = require("discord.js");
const {log} = require("../../../api/utils");
module.exports = {
    name: "syncroniser",
    description: "Permet de syncroniser les permission d'un salon avec sa catégorie",
    subCommande: true,
    options: [
        {
            name: "salon",
            description: "Le salon dont vous voulez maj les permissions.",
            type: 7,
            required: true,
            channelTypes: [0, 2, 5, 13, 15, 16] //salons dans une catégorie
        }
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        const channel = interaction.options.getChannel("salon");
        try {
            await channel.lockPermissions();
        } catch (e) {
            console.log(e);
            return interaction.reply({
                content: `:no_entry_sign: Je n'ai pas les permissions de modifier ce salon.`,
                flags: [MessageFlags.Ephemeral]
            });
        }
        await log(`Les permissions de <#${channel.id}> on été syncronisées avec <#${channel.parentId}> !`, "Maj de permission :", interaction.member, "warning");
        return interaction.reply({
            content: `:white_check_mark: Les permissions de <#${channel.id}> on été syncronisées avec <#${channel.parentId}> !`,
            flags: [MessageFlags.Ephemeral]
        });
    },
}