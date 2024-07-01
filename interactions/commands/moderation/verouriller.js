const roles = require("../../../data/utils/roles.json");
const {log, hasPerm} = require("../../../api/utils.js");
const {PermissionsBitField, MessagePayload} = require("discord.js");
module.exports = {
    name: "verrouiller",
    description: "Permet de verrouiller/déverrouiller un salon.",
    devOnly: true,
    options: [
        {
            name: "salon",
            description: "Le salon que vous souhaitez verrouiller/déverrouiller.",
            type: 7,
            required: true
        }
    ],
    runInteraction: async (client, interaction) => {
        const channel = interaction.options.getChannel("salon");
        if (channel.parentId === "1250122963085430936") return interaction.reply({
            content: ":no_entry_sign: Il n'est pas possible de verrouiller ce salon.",
            ephemeral: true
        });
        if (!hasPerm(channel, "1250812181407338587", "ManageRoles")) return interaction.reply({
            content: ":no_entry_sign: Je n'ai pas les permissions nécessaires pour modifier ce salon.",
            ephemeral: true
        });
        const ver = !hasPerm(channel,roles.adherent, "SendMessages");
        await channel.permissionOverwrites.edit(roles.adherent, {SendMessages: ver}, `Salon ${ver ? "dé" : ""}verrouiller`);
        await channel.send({
            content: `${ver ? ":unlock:" : ":lock:"} Le salon a été ${ver ? "dé" : ""}verrouiller par <@${interaction.user.id}> le <t:${Math.floor(Date.now() / 1000)}:f>.`,
            allowedMentions: {repliedUser: false}
        });
        await log(`Le salon <#${channel.id}> a été **${ver ? "dé" : ""}verrouiller**.`, ":closed_lock_with_key: Verrouillage de salon", interaction.member, "warning");
        return interaction.reply({
            content: `Le salon <#${channel.id}> a bien été ${ver ? "dé" : ""}verrouiller !`,
            ephemeral: true
        });
    }
}