const calendarConfig = require("../../../data/utils/calendar.json");
const {getEvents, embedEvent, rappel} = require("../../../api/google");
const {salons} = require("../../../api/permanent");
const choices = calendarConfig.list.map((c) => {
    return {
        name: c.name,
        value: c.id
    }
});

module.exports = {
    name: "test",
    description: "pour faire des test",
    devOnly: true,
    options: [
        {
            name: "nom",
            description: "Le nom de l'équipe ou du calendrier à afficher.",
            type: 3,
            choices: choices,
            required: true
        }
    ],
    runInteraction: async (client, interaction) => {
        await interaction.deferReply({ephemeral: true});
        /*const timeMin = new Date();
        const decalage = 8 - timeMin.getDay();
        timeMin.setDate(timeMin.getDate());
        const timeMax = new Date();
        timeMax.setDate(timeMax.getDate() + decalage === 8 ? 1 : decalage);
        const events = await getEvents(interaction.options.getString("nom"), timeMin, timeMax);
        if (events.length === 0) return interaction.editReply({
            content: ":x: Aucune reunion trouvée !",
            ephemeral: true
        });
        console.log(events);
        const channel = await interaction.guild.channels.fetch(salons[events[0].calendar.channel]);
        const embeds = events.slice(0, 10).map(cal => embedEvent(cal))
        channel.send({embeds: embeds});*/
        await rappel()
        return interaction.editReply({
            content: `:white_check_mark: aller hop !`,
            ephemeral: true
        });
    }
}