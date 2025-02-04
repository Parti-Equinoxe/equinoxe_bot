const {log} = require("../../../api/utils.js");
const {MessageFlags} = require("discord.js");

module.exports = {
    name: "copier",
    description: "Permet de copier les permission d'un salon vers un autre.",
    subCommande: true,
    options: [
        {
            name: "permission",
            description: "Le salon dont vous voulez copier les permissions.",
            type: 7,
            required: true
        },
        {
            name: "salon",
            description: "Le salon vers lequel copier les permissions.",
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
        const channel_permission = interaction.options.getChannel("permission");
        const permissions = channel_permission.permissionOverwrites.cache.map(p => {
            return {
                id: p.id,
                allow: p.allow.toArray(),
                deny: p.deny.toArray()
            }
        });
        console.log(permissions);
        await channel.permissionOverwrites.set(permissions,`Copie de permission depuis ${channel_permission.name}`);
        await log(`Les permissions de <#${channel_permission.id}> on été appliquées au salon <#${channel.id}>.`, "Copie de permission :", interaction.member, "warning");
        return interaction.reply({
            content: `:white_check_mark: Les permissions de <#${channel_permission.id}> ont bien été appliquées au salon <#${channel.id}> !`,
            flags: [MessageFlags.Ephemeral]
        })
    }
}