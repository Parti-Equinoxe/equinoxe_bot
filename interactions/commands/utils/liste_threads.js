const {ChatInputCommandInteraction, Client, EmbedBuilder} = require("discord.js");

module.exports = {
    name: "liste_fils",
    description: "Permet d'obtenir la liste des fils.",
    options: [
        {
            name: "salon",
            description: "Le salon dans lequel chercher les fils.",
            type: 7,
            required: false
        }
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        const channel = interaction.options.getChannel("salon") ?? interaction.channel;
        //if (channel.isThread()) return interaction.reply({content: "Ce n'est pas un salon de fils !", ephemeral: true});
        const threads = channel.threads.cache.map((t) => t);
        console.log(threads);
        if (threads.length === 0 || !threads) return interaction.reply({content: ":zero: Il n'y a pas de fils dans ce salon.", ephemeral: true});
        const embed = new EmbedBuilder()
            .setTitle(`:thread: Fils de <#${channel.id}>`)
            .setColor("#8d2cde")
            .setFields(threads.slice(0,25).map((t) => ({name: `<#${t.id}>`, value: `** **`})))
            .setDescription(`Il y a **${threads.length}** fil(s).`)
            .setTimestamp();
        return interaction.reply({embeds: [embed]});
    },
};
