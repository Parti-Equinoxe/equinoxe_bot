const { getEvents, embedEvent, rappel } = require("../../../api/google.js");
const client = require("../../../index.js").client;
const { MessageFlags } = require("discord.js");

module.exports = {
    name: "test",
    description: "pour faire des test",
    devOnly: true,
    get options() {
        const config = {};
        const choices = client.configHandler.tryGet("calendars", config)
            ? config.value.list.map((c) => ({ name: c.name, value: c.id }))
            : [];

        return [
            {
                name: "nom",
                description: "Le nom de l'équipe ou du calendrier à afficher.",
                type: 3,
                choices: choices,
                required: true
            }
        ]
    },
    runInteraction: async (user, interaction) => {
        await interaction.deferReply({flags: [MessageFlags.Ephemeral]});
        /*const timeMin = new Date();
        const decalage = 8 - timeMin.getDay();
        timeMin.setDate(timeMin.getDate());
        const timeMax = new Date();
        timeMax.setDate(timeMax.getDate() + decalage === 8 ? 1 : decalage);
        const events = await getEvents(interaction.options.getString("nom"), timeMin, timeMax);
        if (events.length === 0) return interaction.editReply({
            content: ":x: Aucune reunion trouvée !",
            flags: [MessageFlags.Ephemeral]
        });
        console.log(events);
        const channel = await interaction.guild.channels.fetch(salons[events[0].calendar.channel]);
        const embeds = events.slice(0, 10).map(cal => embedEvent(cal))
        channel.send({embeds: embeds});*/
        await rappel(configHandler.get("calendars"))
        return interaction.editReply({
            content: `:white_check_mark: aller hop !`,
            flags: [MessageFlags.Ephemeral]
        });
    }
}