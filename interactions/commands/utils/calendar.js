const {nextWeek} = require("../../../api/google");
const {EmbedBuilder} = require("discord.js");
const {roles} = require("../../../api/permanent");
module.exports = {
    name: "calendrier",
    description: "Permet d'obtenir les prochaines réunions prévu.",
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        await interaction.deferReply();
        const events = await nextWeek();
        const embedAll = new EmbedBuilder()
            .setTitle("Réunion à venir :")
            .setFields(events.slice(0,10).map((event) => {
                return {
                    name: event.name,
                    value: `Le <t:${Math.round(event.start.getTime() / 1000)}:D> de <t:${Math.round(event.start.getTime() / 1000)}:t> à <t:${Math.round(event.end.getTime() / 1000)}:t>.\n> ${event.description ?? "Pas de description."}\nÉquipe${event.roles.length > 1 ? "s" : ""} : ${event.roles.length !== 0 ? event.roles.map(r=>"<@&"+roles[r]+">").join(", ") : "Pas d'équipe spécifié."}`
                }
            }));
        const embedOne = new EmbedBuilder()

        return interaction.editReply({
            embeds: [embedAll]
        });
    },
}