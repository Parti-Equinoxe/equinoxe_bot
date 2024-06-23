const {ChannelType} = require("discord.js");
const {getWebhooks, sendMessagesUsers, log, durationFormatter} = require("../../../api/utils.js");

module.exports = {
    name: "deplacer_conversation",
    description: "Permet de déplacer une conversation (x dernier messages), supprime les message en question !",
    options: [{
        name: "nombre",
        description: "Le nombre de message à déplacer. (max 100)",
        type: 4,
        maxValue: 100,
        required: true,
    }, {
        name: "salon",
        description: "Le salon vers le quel déplacer la conversation.",
        type: 7,
        required: true,
        channelTypes: [0,5,10,11,12,15]
    }],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        const date = Date.now();
        await interaction.deferReply({ephemeral: true});
        const nb = interaction.options.getInteger("nombre");
        const newChannel = interaction.options.getChannel("salon");
        const oldChannel = interaction.channel;
        await oldChannel.messages.fetch({force: true, limit: 100});
        const msgs = oldChannel.messages.cache.map((msg) => {
            return {
                content: msg.content ?? "",
                embeds: msg.embeds ?? [],
                attachments: msg.attachments.map((a) => a),
                createdTimestamp: msg.createdTimestamp,
                member: msg.member,
                id: msg.id
            }
        }).sort((a, b) => b.createdTimestamp - a.createdTimestamp)
            .filter((msg) => (msg.content.length + msg.embeds.length + msg.attachments.length) !== 0)
            .map((msg) => msg).slice(0, nb)
            .sort((a, b) => a.createdTimestamp - b.createdTimestamp);

        await interaction.editReply({
            content: `**${msgs.length}/${nb}** messages vont être déplacer vers <#${newChannel.id}> (à une vitesse de 1msg/s) !`,
            ephemeral: true
        });
        const i = await sendMessagesUsers(msgs, newChannel);
        const bDinfo = (await oldChannel.bulkDelete(msgs, false)).map((msg) => msg);
        oldChannel.send({
            content: `Les dernier **${bDinfo.length}** messages ont été déplacés ver <#${newChannel.id}> !\nMerci de continuer votre conversation sur l'autre salon.`
        })
        await log(`**${i}/${msgs.length}** messages ont été déplacés depuis <#${oldChannel.id}> vers <#${newChannel.id}> en **${durationFormatter(Date.now() - date)}** !`, "Déplacement de conversation", interaction.member, "deplacement");
        return newChannel.send({content: `**${i}/${msgs.length}** messages ont été déplacés depuis <#${oldChannel.id}> en **${durationFormatter(Date.now() - date)}**`});
    }
};