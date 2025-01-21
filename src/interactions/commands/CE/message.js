const categories = require("../../../data/utils/categories.json");
const {ChannelType, EmbedBuilder} = require("discord.js");
const {couleurs} = require("../../../api/permanent");

module.exports = {
    name: "message",
    description: "Permet d'envoyer un message dans un salons.",
    options: [
        {
            name: "salon",
            description: "Salon dans le quel envoyer le message.",
            type: 7,
            required: true,
        },
        {
            name: "message",
            description: "Le message a envoyer.",
            type: 3,
            required: true,
        }
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        const channel = interaction.options.getChannel("salon");
        const embed = new EmbedBuilder()
            .setDescription("## __Message du Comité d'Éthique :__\n"+interaction.options.getString("message"))
            .setColor(couleurs.jaune)
            .setAuthor({name: interaction.member.nickname ?? interaction.user.globalName, iconURL: interaction.member.displayAvatarURL()})
            .setFooter({text: "Le Comité d'Éthique"})
            .setTimestamp();
        const msg = await channel.send({embeds: [embed]});
        return interaction.reply({
            content: `Le message a bien été envoyé ${msg.url} !`,
        });
    }
};