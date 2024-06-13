const {EmbedBuilder} = require("discord.js");
module.exports = {
    name: "test",
    description: "pour faire des test",
    devOnly: true,
    runInteraction: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setTitle("test")
            .setColor("#ffd412")
            .setDescription("test")
            .setFields([
                {
                    name: "test",
                    value: "test"
                }
            ])
            .setTimestamp();
        console.log(embed.toJSON());
        return interaction.reply("test!");
    }
}