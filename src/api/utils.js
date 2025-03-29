const {client} = require("../index.js");
const removeAccents = require('remove-accents');
const {
    GuildBasedChannel,
    BaseGuildTextChannel,
    parseEmoji,
    Snowflake,
    MessagePayload,
    EmbedBuilder, ButtonBuilder, ActionRowBuilder,
    GuildTextBasedChannel, Role
} = require("discord.js");
const salons = require("../data/utils/salons.json");

/**
 * @param {GuildBasedChannel.id | String | Snowflake} channelID - l'ID du salon
 * @return {Promise<GuildBasedChannel | BaseGuildTextChannel>}
 */
module.exports.getChannel = async (channelID) => {
    return await (await this.getGuild()).channels.fetch(channelID);
};

/**
 * @return {Promise<Guild>}
 */
module.exports.getGuild = async () => {
    return await client.guilds.fetch(client.config.guildID, {force: true});
};

/**
 * @param {BaseGuildTextChannel} channel - le channel ou recup le webhook
 * @param {GuildMember} member - le user (*message.author*)
 * @return {Promise<Webhook>}
 */
module.exports.getWebhooks = async (channel, member) => {
    let webhook = (await channel.fetchWebhooks()).filter((w) => w.owner.id === client.user.id);
    if (webhook.size === 0) {
        const w = await channel.createWebhook({
            name: member.nickname ?? member.user.username,
            avatar: member.user.displayAvatarURL({dynamic: true}),
        });
        return w;
    }
    webhook = webhook.first();
    if (webhook.name !== member.user.username) {
        await webhook.edit({
            name: member.nickname ?? member.user.username,
            avatar: member.user.displayAvatarURL({dynamic: true}),
        });
    }
    return webhook;
};

/**
 * @param {number | string} nb - le nombre à transformer
 * @returns {string}
 */
module.exports.numberPretier = (nb) => {
    nb = parseInt(nb);
    const len = nb.toString().length;
    if (len <= 3) return nb.toString();
    if (len <= 6) return `${Math.round(nb / 100) / 10}k`;
    if (len <= 9) return `${Math.round(nb / 100000) / 10}M`;
    if (len <= 12) return `${Math.round(nb / 100000000) / 10}G`;
    return `${Math.round(nb / 100000000000) / 10}T`;
};

const timeFormats = [
    {
        name: "ms",
        value: 1,
    }, {
        name: "s",
        value: 1000,
    }, {
        name: "min",
        value: 60000,
    }, {
        name: "h",
        value: 3600000,
    }, {
        name: "jours",
        value: 86400000,
    }, {
        name: "semaines",
        value: 604800000,
    }, {
        name: "mois",
        value: 2629800000
    }
].reverse();
/**
 * @param {number} temps - le temps en ms
 * @returns {string}
 */
module.exports.durationFormatter = (temps) => {
    let text = "";
    for (const timeFormat of timeFormats) {
        const nb = (temps - temps % timeFormat.value) / timeFormat.value;
        if (nb <= 0) continue;
        text += ` **${nb}**${timeFormat.name}`;
        temps = temps % timeFormat.value;
    }
    return text;
};

const unicodeEmoji = new RegExp(
    "^[" +
    "\u{1F1E0}-\u{1F1FF}" +  // flags (iOS)
    "\u{1F300}-\u{1F5FF}" +  // symbols & pictographs
    "\u{1F600}-\u{1F64F}" +  // emoticons
    "\u{1F680}-\u{1F6FF}" +  // transport & map symbols
    "\u{1F700}-\u{1F77F}" +  // alchemical symbols
    "\u{1F780}-\u{1F7FF}" +  // Geometric Shapes Extended
    "\u{1F800}-\u{1F8FF}" +  // Supplemental Arrows-C
    "\u{1F900}-\u{1F9FF}" +  // Supplemental Symbols and Pictographs
    "\u{1FA00}-\u{1FA6F}" +  // Chess Symbols
    "\u{1FA70}-\u{1FAFF}" +  // Symbols and Pictographs Extended-A
    "\u{2702}-\u{27B0}" +    // Dingbats
    "\u{24C2}-\u{1F251}" +
    "]$", "u"
);
/**
 * @param {string} emoji - l'emoji a tester
 * @return {boolean}
 */
module.exports.isValideEmoji = (emoji) => {
    return unicodeEmoji.test(parseEmoji(emoji).name) || parseEmoji(emoji).id !== undefined;
}
/**
 * @param {string} emoji - l'emoji a tranformer
 * @return {string} - l'emoji sous un format valide
 */
module.exports.parseValideEmoji = (emoji) => {
    if (!this.isValideEmoji(emoji)) return "🚫";
    if (unicodeEmoji.test(parseEmoji(emoji).name)) return parseEmoji(emoji).name;
    return `<${parseEmoji(emoji).animated ? "a" : ""}:${parseEmoji(emoji).name}:${parseEmoji(emoji).id}>`;
}

/**
 * @param {string} texte - le texte a simplifier
 * @return {string} - le texte sans accents ni émoji
 */
module.exports.simplify = (texte) => {
    return removeAccents(texte).replaceAll(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B06}\u{2194}\u{2934}\u{25AA}\u{25FE}]/gu, "");
}

/**
 * Send a message in the log-bot channel.
 *
 * @param {string | MessagePayload} message - The message to be send in the channel log
 * @return {Promise<void>} A promise that resolves when the message is successfully logged
 */
/*module.exports.log = async (message) => {
    (await this.getChannel(salons.log)).send(message);
}*/
/**
 * Send a message in the log-channel channel.
 *
 * @param {string | MessagePayload} message - The message to be send in the channel log
 * @return {Promise<void>} A promise that resolves when the message is successfully logged
 */
module.exports.logChannel = async (message) => {
    (await this.getChannel(salons.logChannel)).send(message);
}

/**
 * @param {Array<{member: GuildMember, content: string, embeds: Object[], attachments: Attachment[], createdTimestamp: number}>} messages - les messages
 * @param {GuildTextBasedChannel} channel - le channel
 * @return {Promise<number>} - le nombre de messages envoyé
 */
module.exports.sendMessagesUsers = async (messages, channel) => {
    console.log(`Début d'envoie de ${messages.length} messages dans ${channel.name}`);
    const threadId = channel.isThread() ? channel.id : null;
    channel = channel.isThread() ? await this.getChannel(channel.parentId) : channel
    let nb = 0, webhook = (await channel.fetchWebhooks()).filter((w) => w.owner.id === client.user.id);
    if (webhook.size === 0) {
        webhook = await channel.createWebhook({
            name: "MEssage",
        });
    } else {
        webhook = webhook.first();
    }
    for (const message of messages) {
        await sendMessageWebhook(webhook, message, threadId);
        nb++;
    }
    console.log(`Fin d'envoie de ${messages.length} messages dans ${channel.name}`);
    return nb;
}

function sendMessageWebhook(webhook, message, threadId) {
    if (webhook.name !== (message.member.nickname ?? message.member.user.username)) {
        return webhook.edit({
            name: message.member.nickname ?? message.member.user.username,
            avatar: message.member.user.displayAvatarURL({dynamic: true}),
        }).then(async (webhook) => {
            webhook.send({
                content: message.content,
                files: message.attachments,
                embeds: message.embeds,
                threadId: threadId
            });
        });
    } else {
        return webhook.send({
            content: message.content,
            files: message.attachments,
            embeds: message.embeds,
            threadId: threadId
        });
    }
}

const colorByCode = {
    "info": "#f8d796",
    "success": "#43b581",
    "warning": "#faa61a",
    "error": "#f04747",
    "deplacement": "#7289da"
}
/**
 * @param {string} message - le message
 * @param {string} titre - le titre
 * @param {GuildMember} member - le membre
 * @param {string} type - le type
 * @return {Promise}
 */
module.exports.log = async (message, titre, member, type = "info") => {
    const embed = new EmbedBuilder()
        .setColor(colorByCode[type] ?? colorByCode)
        .setTitle(titre)
        .setDescription(message)
        .setAuthor({name: member.nickname ?? member.user.username, iconURL: member.user.displayAvatarURL()})
        .setTimestamp();
    return (await this.getChannel(salons.log)).send({embeds: [embed]}); // TODO: remplacer cella par logChannel de la config
}
/**
 * @param {string} message - le message
 * @param {string} titre - le titre
 * @param {GuildMember} member - le membre
 * @param {string} type - le type
 * @param attachment
 * @return {Promise}
 */
module.exports.logWithImage = async (message, titre, member, type = "info", attachment) => {
    const embed = new EmbedBuilder()
        .setColor(colorByCode[type] ?? colorByCode)
        .setTitle(titre)
        .setDescription(message)
        .setAuthor({name: member.nickname ?? member.user.username, iconURL: member.user.displayAvatarURL()})
        .setImage(attachment.name.includes(".png") ? `attachment://${attachment.name}` : null)
        .setTimestamp();
    return (await this.getChannel(salons.log)).send({embeds: [embed], files: [attachment]}); // TODO: remplacer cella par logChannel de la config
}
/**
 * @param {GuildTextBasedChannel} channel - le channel
 * @param {Role.id | string} roleID - l'ID du role
 * @param {string} permission - la permission
 * @return {boolean}
 */
module.exports.hasPerm = (channel, roleID, permission) => {
    const perm = channel.permissionOverwrites.cache.map(p => {
        return {
            id: p.id,
            allow: p.allow.toArray(),
            deny: p.deny.toArray()
        }
    }).find(p => p.id === roleID);
    if (!perm) return false;
    return (perm.allow.includes(permission) && !perm.deny.includes(permission));
}