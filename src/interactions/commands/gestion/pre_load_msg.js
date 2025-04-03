const { ChatInputCommandInteraction, Client, MessageFlags } = require("discord.js");
const { getAllPrefabMessages, getMessage } = require("../../../api/prefabMessage.js");

module.exports = {
    name: "pre_load_message",
    description: "Envoy un message pre écrit.",
    options: [
        {
            name: "message",
            description: "Le message à envoyer",
            type: 3,
            required: true,
            autocomplete: true,
        },
        {
            name: "salon",
            description: "Le salon où envoyer le message",
            type: 7,
        },
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        await interaction.deferReply({flags: [MessageFlags.Ephemeral]});
        const msgName = interaction.options.getString("message");
        const channel = interaction.options.getChannel("salon") ?? interaction.channel;
        const messageTemplate = getAllPrefabMessages()[msgName];
        if (!messageTemplate) return interaction.reply({ content: `Il n'y a pas de message pré-enregistrer nommé **${msgName}** !` });
        const message = getMessage(messageTemplate, interaction.guild);
        await channel.send(message);
        return interaction.editReply({
            content: `Le message pré-enregistré **${msgName}** a bien été posté dans <#${channel.id}> !`,
            flags: [MessageFlags.Ephemeral]
        });
    },
    /**
     * @param {AutocompleteInteraction} interaction
     * @param {Client} client
     */
    runAutocomplete: async (client, interaction) => {
        const focusedOptions = interaction.options.getFocused(true);
        const filtered = Object.keys(getAllPrefabMessages()).filter((c) => c.includes(focusedOptions.value));
        if (filtered.length === 0) return await interaction.respond([{
            name: "Ceci n'est pas un message pre-enregistré valide…",
            value: "pasUnMsg"
        }]);
        const filterLimite = filtered.slice(0, 15);
        await interaction.respond(filterLimite.map((c) => ({name: c, value: c})));
    }
};