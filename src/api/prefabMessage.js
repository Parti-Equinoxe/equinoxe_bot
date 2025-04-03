const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ChatInputCommandInteraction, parseEmoji, AttachmentBuilder
} = require("discord.js");
const client = require("../index").client;

/**
 * Récupère tous les messages préenregistrés à partir de la configuration du client ("prefabMessages").
 *
 * @returns Si la config est définie renvois la config relatif au message prefabriquer. Le nom des champs serve de clée pour les message. Si la config n'existe pas un object vide est renvoiler.
 */
function getAllPrefabMessages() {
    const messages = {};
    if (client.configHandler.tryGet("prefabMessages", messages))
        return messages.value;
    return null;
}

/**
 * Génère un objet message tirée de la config.
 *
 * @param {string} messageTemplate Le modèle du message.
 * @param {import('discord.js').Guild|null} [guild=null] L'objet guild de Discord, utilisé pour récupérer les noms des rôles si nécessaire.
 * @returns {import('discord.js').MessagePayload|null} Un MessagePayload ou null si le message n'existe pas.
 */ // Je ne suis pas certaint que ce soit un MessagePayload
function getMessage(messageTemplate, guild = null) {
    const embeds = [];
    const components = [];
    const files = {};

    for (const composent of Object.values(messageTemplate)) {
        switch (composent.type) {
            case "embed": {
                const embedBuilder = new EmbedBuilder();
                setEmbed(embedBuilder, composent, files);
                embeds.push(embedBuilder);
                break;
            }
            case "button": {
                const buttonBuilder = new ButtonBuilder();
                if (composent.label)
                    buttonBuilder.setLabel(composent.label);
                if (composent.style)
                    buttonBuilder.setStyle(composent.style);
                if (composent.id)
                    buttonBuilder.setCustomId(composent.id);
                if (composent.emoji)
                    buttonBuilder.setEmoji(composent.emoji);
                // TODO: buttonBuilder.setURL
                // buttonBuilder.setDisabled
                components.push(new ActionRowBuilder().addComponents(buttonBuilder));
                break;
            }
            case "special_roleAssignation": {
                const embedBuilder = new EmbedBuilder();
                embedBuilder
                    .setFooter({ text: "Cliquez sur les boutons ci-dessous pour vous ajouter/retirer des roles." })
                    .addFields({
                        name: "__Liste des rôles :__",
                        value: composent.roles.map(getRoleInfo).join('\n')
                    });
                setEmbed(embedBuilder, composent, files);
                embeds.push(embedBuilder);
                const nbPerRow = composent.nbPerRow ?? 4; // Default 4 si non définie, valeur totalement arbitraire
                const raws = Math.min(Math.ceil(composent.roles.length / nbPerRow), 5);
                for (let index = 0; index < raws; index++) {
                    components.push(new ActionRowBuilder().addComponents(composent.roles.slice(nbPerRow * index, nbPerRow * (index + 1)).map((role) => {
                        const buttonBuilder = new ButtonBuilder()
                            .setCustomId(`contribuer:give_role ${role.roleID}`);
                        if (role.emoji)
                            buttonBuilder.setEmoji(parseEmoji(role.emoji));
                        if (role.roleID)
                            buttonBuilder.setLabel(role.name);
                        else if (guild) {
                            const guildRole = guild.roles.cache.get(role.roleID);
                            if (guildRole)
                                buttonBuilder.setLabel(guildRole.name);
                        }
                        if (role.style)
                            buttonBuilder.setStyle(role.style);
                        else
                            buttonBuilder.setStyle(2);
                        return buttonBuilder;
                    })));
                }
                break;
            }
        }
    }
    return {
        embeds: embeds,
        components: components,
        files: Object.values(files),
    }
}

function getRoleInfo(role)
{
    let result = "- ";
    if (role.emoji)
        result += role.emoji + "・ ";
    result += `<@&${role.roleID}>`;
    if (role.description)
        result += `\n> ${role.description}`
    if (role.refID)
        result += `\n> => <@&${role.refID}>`;
    return result;
}


/**
 * @param {EmbedBuilder} embedBuilder
 * @param {string} composent
 */
function setEmbed(embedBuilder, composent, files) {
    if (composent.description)
        embedBuilder.setDescription(composent.description);
    if (composent.color)
        embedBuilder.setColor(composent.color);
    if (composent.thumbnail) {
        embedBuilder.setThumbnail(composent.thumbnail.link);
        if (!files[composent.thumbnail.link])
            files[composent.thumbnail.link] = new AttachmentBuilder(composent.thumbnail.attachement, composent.thumbnail.attachementData);
    }
    if (composent.image) {
        embedBuilder.setImage(composent.image.link);
        if (!files[composent.thumbnail.link])
            files[composent.thumbnail.link] = new AttachmentBuilder(composent.thumbnail.attachement, composent.thumbnail.attachementData);
    }
    if (composent.fields) {
        for (const field of Object.values(composent.fields)) {
            embedBuilder.addFields({
                name: field.name,
                value: field.value,
                inline: field.inline ?? false
            });
        }
    }
    if (composent.title)
        embedBuilder.setTitle(composent.title);
    if (composent.footer)
        embedBuilder.setFooter(composent.footer);
    if (composent.author)
        embedBuilder.setAuthor(composent.author);
    if (composent.timestamp) {
        if (composent.timestamp === "now")
            embedBuilder.setTimestamp(Date.now());
        else if (typeof composent.timestamp === "number")
            embedBuilder.setTimestamp(composent.timestamp);
        else
            embedBuilder.setTimestamp();
    }
    // TODO: embedBuilder.setTimestamp
    // embedBuilder.setURL
}

module.exports.getAllPrefabMessages = getAllPrefabMessages;
module.exports.getMessage = getMessage;
module.exports.setEmbed = setEmbed;