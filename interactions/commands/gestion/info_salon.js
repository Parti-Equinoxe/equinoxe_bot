const {EmbedBuilder} = require("discord.js");

module.exports = {
    name: "information_salon",
    description: "Donne des informations sur un salon (permissions).",
    options: [{
        name: "salon",
        description: "Le salon dont vous voulez voir les informations.",
        type: 7,
        required: true,
    }, {
        name: "permission",
        description: "Si vous voulez voir les permissions du salon.",
        type: 5,
        defaultValue: false
    }],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        const channel = interaction.options.getChannel("salon");
        const showPermissions = interaction.options.getBoolean("permission");
        const embed = new EmbedBuilder()
            .setTitle(`Informations sur le salon <#${channel.id}> :`)
            .setDescription(channel.isTextBased() ? channel.topic ?? null : null)
            .setFields([
                {
                    name: "Date de creation :",
                    value: `> <t:${Math.floor(channel.createdTimestamp / 1000)}:F>`,
                    inline: true
                },
                {
                    name: "Position :",
                    value: `> ${channel.position}`,
                    inline: true
                },
                {
                    name: "Catégorie :",
                    value: `> ${channel.parent ? channel.parent.name.replaceAll("—", "> ") : "Pas de catégorie"}`,
                    inline: true
                },
            ])
            .setColor("#3190de")
            .setFooter({text: `<#${channel.id}>`})
            .setTimestamp();
        if (!showPermissions) return interaction.reply({embeds: [embed]})
        const permission = channel.permissionOverwrites.cache.map(p => {
            return {
                id: p.id,
                allow: p.allow.toArray(),
                deny: p.deny.toArray()
            };
        });
        const allow = permission.map(p => {
            return p.allow.map(pa => {
                return JSON.parse(`{"${pa}": "${p.id}"}`)
            })
        }).flat().reduce((acc, cur) => {
            const name = Object.keys(cur)[0];
            const id = cur[name];
            if (acc[name]) {
                acc[name].push(id);
            } else {
                acc[name] = [id];
            }
            return acc;
        }, {});
        const deny = permission.map(p => {
            return p.deny.map(pd => {
                return JSON.parse(`{"${pd}": "${p.id}"}`)
            })
        }).flat().reduce((acc, cur) => {
            const name = Object.keys(cur)[0];
            const id = cur[name];
            if (acc[name]) {
                acc[name].push(id);
            } else {
                acc[name] = [id];
            }
            return acc;
        }, {});
        const allowArray = Object.entries(allow).map(([key, value]) => {
            return {
                permission: key,
                roles: value
            }
        });
        const denyArray = Object.entries(deny).map(([key, value]) => {
            return {
                permission: key,
                roles: value
            }
        });
        const embedPermAllow = new EmbedBuilder()
            .setDescription("## __:white_check_mark: Permissions autorisées :__")
            .setFields(allowArray.map((ap) => {
                if (ap.roles.length === 0) return;
                return {
                    name: `**${ap.permission}** :`,
                    value: `> <@&${ap.roles.join("> <@&")}>`,
                }
            }).slice(0, 25))
            .setColor("#5bbe29");
        const embedPermDeny = new EmbedBuilder()
            .setDescription("## __:x: Permissions refusées :__")
            .setFields(denyArray.map((dp) => {
                if (dp.roles.length === 0) return;
                return {
                    name: `**${dp.permission}** :`,
                    value: `> <@&${dp.roles.join("> <@&")}>`,
                }
            }).slice(0, 25))
            .setColor("#d72121");
        const embeds = [embed];
        if (allowArray.length > 0) embeds.push(embedPermAllow);
        if (denyArray.length > 0) embeds.push(embedPermDeny);
        return interaction.reply({embeds: embeds});
    }

};