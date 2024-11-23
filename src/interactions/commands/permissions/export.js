const {AttachmentBuilder} = require("discord.js");
module.exports = {
    name: "export",
    description: "Permet d'exporter les permission d'un salon.",
    subCommande: true,
    options: [
        {
            name: "salon",
            description: "Le salon dont vous voulez exporter les permissions.",
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
        const permission = channel.permissionOverwrites.cache.map(p => {
            return {
                id: p.id,
                allow: p.allow.toArray(),
                deny: p.deny.toArray()
            };
        });
        const json = new AttachmentBuilder()
            .setName(`permission_${channel.name}.json`)
            .setFile(Buffer.from(JSON.stringify(permission, null, 2)));

        return interaction.reply({content: "Voici l'export des permissions :", files: [json]});
    }
}