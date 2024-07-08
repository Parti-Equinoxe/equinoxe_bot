const {ChatInputCommandInteraction, Client} = require("discord.js");
const {readdirSync} = require("fs");
const pre_load_msgs = readdirSync("./data/pre_load/").filter((file) => file.endsWith(".js")).map((msg) => {
    //permet de vérifier et que tou va bien
    require(`../../../data/pre_load/${msg}`);
    return msg.replace(".js", "");
});

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
        const msgName = interaction.options.getString("message");
        const channel = interaction.options.getChannel("salon") ?? interaction.channel;
        if (!pre_load_msgs.includes(msgName)) return interaction.reply({content: `Il n'y a pas de message pré-enregistrer nommé **${msgName}** !`});
        const msg = require(`../../../data/pre_load/${msgName}.js`);
        await channel.send(await msg.send(interaction));
        return interaction.reply({
            content: `Le message pré-enregistré **${msgName}** a bien été posté dans <#${channel.id}> !`,
            ephemeral: true
        });
    },
    /**
     * @param {AutocompleteInteraction} interaction
     * @param {Client} client
     */
    runAutocomplete: async (client, interaction) => {
        const focusedOptions = interaction.options.getFocused(true);
        const filtered = pre_load_msgs.filter((c) => c.includes(focusedOptions.value));
        if (filtered.length === 0) return await interaction.respond([{
            name: "Ceci n'est pas un message pre-enregistré valide…",
            value: "pasUnMsg"
        }]);
        const filterLimite = filtered.slice(0, 15);
        await interaction.respond(filterLimite.map((c) => ({name: c, value: c})));
    }
};