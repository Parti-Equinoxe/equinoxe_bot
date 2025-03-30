const {roles} = require("../../../api/permanent");
const {MessageFlags} = require("discord.js");
const {log} = require("../../../api/utils");
module.exports = {
    name: "set",
    description: "Permet d'appliquer les permission d'un salon du role adh au nouveau.",
    subCommande: true,
    options: [
        {
            name: "salon",
            description: "Le salon dont vous voulez maj les permissions.",
            type: 7,
            required: true
        }/*,
        {
            name: "permission",
            description: "Le set de permission que vous voulez appliquer.",
            type: 3,
            required: true,
            choice: permissions_set.map(p => ({name: p.name, value: p.name}))
        }*/
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        const channel = interaction.options.getChannel("salon");
        const permission = channel.permissionOverwrites.cache.map(p => {
            return {
                id: p.id, // nouveau role id
                allow: p.allow.toArray(),
                deny: p.deny.toArray()
            };
        });
        const new_perm = permission.filter(p => p.id === roles.adherent).map(p => {
            return {
                id: roles.adherent,//adh connecte
                allow: p.allow,
                deny: p.deny
            }
        });
        permission.push(...new_perm);
        try {
            await channel.permissionOverwrites.set(permission, `Copies des permissions vers <@&1325177770824957952>`);
        } catch (e) {
            console.log(e);
            return interaction.reply({
                content: `:no_entry_sign: Je n'ai pas les permissions de modifier ce salon.`,
                flags: [MessageFlags.Ephemeral]
            });
        }
        await log(`Les permissions pour le nouveau role adhérent on été appliquées au salon <#${channel.id}>.`, "Maj de permission :", interaction.member, "warning");
        return interaction.reply({
            content: `:white_check_mark: Les permissions pour le nouveau role adhérent ont bien été appliquées au salon <#${channel.id}> !`,
            flags: [MessageFlags.Ephemeral]
        });
    },
}