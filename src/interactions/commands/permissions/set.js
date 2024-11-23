const permissions_set = require("../../../data/utils/permissions_set.json");
module.exports = {
    name: "set",
    description: "Permet d'appliquer les permission d'un salon.",
    subCommande: true,
    devOnly: true,
    options: [
        {
            name: "salon",
            description: "Le salon dont vous voulez exporter les permissions.",
            type: 7,
            required: true
        },
        {
            name: "permission",
            description: "Le set de permission que vous voulez appliquer.",
            type: 3,
            required: true,
            choice: permissions_set.map(p => ({name: p.name, value: p.name}))
        }
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        const channel = interaction.options.getChannel("salon");
        const permission = permissions_set.find(p => p.name === interaction.options.getString("permission"));
        console.log(permission);
    },
}