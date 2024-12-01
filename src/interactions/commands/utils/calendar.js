const {nextWeek} = require("../../../api/google");
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
    description: "Permet d'obtenir les prochaines réunions prévu.",
    devOnly: true,
    options: [
        {
            name: "nom",
            description: "Le nom de l'équipe ou du calendrier.",
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
        const embedAll = new EmbedBuilder()
            .setTitle("Réunion à venir :")
            .setColor(calendarConfig.list.find(c => c.id === filter[0]).color)
            .setFields(events.flat().slice(0, 10).map((event) => {
                const cal = calendarConfig.list.find(c => c.id === event.calID);
                console.log(cal)
                return {
                    name: event.name,
                    value: `Le <t:${Math.round(event.start.getTime() / 1000)}:D> de <t:${Math.round(event.start.getTime() / 1000)}:t> à <t:${Math.round(event.end.getTime() / 1000)}:t>.\n> ${event.description ?? "Pas de description."}\nÉquipe${/*event.roles.length > 1 ? "s" : */""} : <@&${/*event.roles.length !== 0 ? event.roles.map(r => "<@&" + roles[r] + ">").join(", ") : "Pas d'équipe spécifié."*/roles[cal.role]}>`
                }
            }))
            .setTimestamp();

        return interaction.editReply({
            embeds: [embedAll]
        });
    },
}