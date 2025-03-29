const { EmbedBuilder, MessageFlags } = require("discord.js");
const client = require("../../../index.js").client;
const { setEmbed } = require("../../../api/prefabMessage.js");
const programmeID = "861575978156687370";
module.exports = {
    name: "programme",
    description: "Permet d'obtenir la liste des discussions du pôle programme en cours.",
    options: [
        {
            name: "recherche",
            description: "La recherche que vous voulez effectuer.",
            type: 7,
            required: true,
            channelTypes: [11, 15],
        }
    ],
    runInteraction: async (_, interaction) => {
        const config = {};
        if (!client.configHandler.tryGet("ProgrammeAwnser", config)) {
            return interaction.reply({
                content: "Cette commande n'a pas été configurer/activer.",
                flags: [MessageFlags.Ephemeral]
            });
        }
        const channel = interaction.options.getChannel("recherche");
        const forum = channel.isThread() ? (await interaction.guild.channels.fetch(channel.parentId)) : channel;
        if (forum.parentId !== programmeID) return interaction.reply({
            content: ":x: Ce salon n'est pas un canal du pôle programme.",
            flags: [MessageFlags.Ephemeral]
        });
        const fields = [];
        if (channel.isThread()) {
            const lastMsg = await channel.messages.fetch(channel.lastMessageId);
            fields.push({
                name: `<#${channel.id}> (${channel.totalMessageSent}) :`,
                value: `Dernier message le <t:${Math.floor(lastMsg.createdTimestamp / 1000)}:d>`,
            });
            fields.push({
                name: "Catégorie :",
                value: `<#${forum.id}> (${forum.threads.cache.size})`,
            })
        } else {
            const fieldsThreads = []
            for (const t of forum.threads.cache.map((t) => t)) {
                const lastMsg = await t.messages.fetch(t.lastMessageId);
                fieldsThreads.push({
                    name: `<#${t.id}> (${t.totalMessageSent}) :`,
                    value: `Dernier message le <t:${Math.floor(lastMsg.createdTimestamp / 1000)}:d>`,
                    timestamp: lastMsg.createdTimestamp
                });
            }
            fieldsThreads.sort((a, b) => b.timestamp - a.timestamp);
            fieldsThreads.slice(0, 24).forEach(t=>{
                fields.push({name: t.name, value: t.value});
            });
        }
        const embed = new EmbedBuilder();
        setEmbed(embed, config.value);
        for (const field of fields.fields) {
            embed.addFields(field);
        }
        return interaction.reply({embeds: [embed], flags: [MessageFlags.Ephemeral]});
    },
}