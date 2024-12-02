const {nextWeek, embedEvents, embedEvent} = require("../../../api/google");
const {EmbedBuilder} = require("discord.js");
const {roles} = require("../../../api/permanent");
const calendarConfig = require("../../../data/utils/calendar.json");
const {userARole} = require("../../../api/role");
const choices = calendarConfig.list.map((c) => {
    return {
        name: c.name,
        value: c.id
    }
});
module.exports = {
    name: "calendrier",
    description: "Permet d'obtenir les prochaines réunions prévues.",
    devOnly: true,
    options: [
        {
            name: "nom",
            description: "Le nom de l'équipe ou du calendrier à afficher.",
            type: 3,
            choices: choices
        }
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        const filter = [interaction.options.getString("nom") ?? calendarConfig.list.map((cal) => {
            return userARole(interaction.member.roles.cache, roles[cal.role]) ? cal.id : false
        }).filter(c => c) ?? false].flat();
        if (!filter[0] || filter.length === 0) return interaction.reply({
            content: ":x: Pas de calendrier trouvé à partir de vos rôles !\nVous pouvez regarder les calendrier en spécifiant leur nom.",
            ephemeral: true
        });
        await interaction.deferReply();
        const events = [];
        for (const id of filter) events.push(await nextWeek(id));
        if (events.flat().length === 0) return interaction.editReply({
            content: ":x: Pas de calendrier trouvé à partir de vos rôles !\nVous pouvez regarder les calendrier en spécifiant leur nom.",
        });
        console.log(events);
        const embeds = events.slice(0, 10).map(cal => embedEvents(cal.slice(0, 10))
            .setTitle("Réunion à venir :"));
        return interaction.editReply({
            embeds: embeds
        });
    },
}