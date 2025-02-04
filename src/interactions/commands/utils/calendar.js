const {embedEvents, thisWeek, weekTimeEnd} = require("../../../api/google");
const {roles} = require("../../../api/permanent");
const calendarConfig = require("../../../data/utils/calendar.json");
const {userARole} = require("../../../api/role");
const {ChatInputCommandInteraction, Client, MessageFlags} = require("discord.js");
const choices = calendarConfig.list.map((c) => {
    return {
        name: c.name,
        value: c.id
    }
});

module.exports = {
    name: "calendrier",
    description: "Permet d'obtenir les prochaines réunions prévues (semaine prochaine).",
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
            flags: [MessageFlags.Ephemeral]
        });
        await interaction.deferReply();
        const timeMin = new Date();
        const timeMax = weekTimeEnd(timeMin, 1);
        const events = [];
        for (const id of filter) events.push(await thisWeek(id));
        if (events.flat().length === 0) return interaction.editReply({
            content: `:x: Pas de réunion trouvée du <t:${Math.round(timeMin.getTime() / 1000)}:d> au <t:${Math.round(timeMax.getTime() / 1000)}:d> !`,
        });
        const embeds = events.slice(0, 10).filter(cal => cal.length > 0).map(cal => embedEvents(cal.slice(0, 10))
            .setDescription(`## Réunion(s) du <t:${Math.round(timeMin.getTime() / 1000)}:d> au <t:${Math.round(timeMax.getTime() / 1000)}:d>`));
        return interaction.editReply({
            embeds: embeds
        });
    },
}