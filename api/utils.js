const {client} = require("../index.js");
const {
    GuildBasedChannel,
    BaseGuildTextChannel,
    User,
    parseEmoji,
    Snowflake,
    MessagePayload,
    EmbedBuilder, ButtonBuilder, ActionRowBuilder
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
    return await client.guilds.fetch(client.config.guildID);
};

/**
 * @param {BaseGuildTextChannel} channel - le channel ou recup le webhook
 * @param {User} user - le user (*message.author*)
 * @return {Promise<Webhook>}
 */
module.exports.getWebhooks = async (channel, user) => {
    let webhook = (await channel.fetchWebhooks()).filter((w) => w.owner.id === client.user.id);
    console.log(webhook);
    if (!webhook || webhook.length === 0 || !webhook.first()) {
        await channel.createWebhook({
            name: user.username,
            avatar: user.displayAvatarURL({dynamic: true}),
        });
        return webhook;
    }
    webhook = webhook.first();
    //if (webhook) {
        if (webhook.name !== user.username) {
            await webhook.edit({
                name: user.username,
                avatar: user.displayAvatarURL({dynamic: true}),
            });
        }
        return webhook;
    //}
};

/**
 * @param {number | string} nb - le nombre à transformer (K/M)
 * @returns {string}
 */
module.exports.numberPretier = (nb) => {
    nb = parseInt(nb);
    const len = nb.toString().length;
    if (len <= 3) {
        return nb.toString();
    }
    if (len <= 6) {
        return `${Math.round(nb / 100) / 10}k`;
    }
    if (len <= 9) {
        return `${Math.round(nb / 100000) / 10}M`;
    }
    return `${Math.round(nb / 100000000) / 10}G`;
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
 * Send a message in the log-bot channel.
 *
 * @param {string | MessagePayload} message - The message to be send in the channel log
 * @return {Promise<void>} A promise that resolves when the message is successfully logged
 */
module.exports.log = async (message) => {
    (await this.getChannel(salons.log)).send(message);
}
/**
 * Send a message in the log-channel channel.
 *
 * @param {string | MessagePayload} message - The message to be send in the channel log
 * @return {Promise<void>} A promise that resolves when the message is successfully logged
 */
module.exports.logChannel = async (message) => {
    (await this.getChannel(salons.logChannel)).send(message);
}

module.exports.sendError = async (message) => {
    (await this.getChannel(salons.crash)).send({
        content: "<@958057847306985503> <@665266080285196299> !", embeds: [new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(message.slice(0, 4095))
            .setTimestamp()
        ],
        components: [new ActionRowBuilder().addComponents(new ButtonBuilder()
            .setCustomId("bug:clearerreur")
            .setEmoji("🗑")
            .setStyle(4))]
    }).catch(() => {
    });
}

module.exports.logBdd = (userID, type, data) => {
    //TODO : Log in bdd for web panel
    return "In dev"
}

/**
 * @param {DataManager.cache} rolesUser - les roles de l'utilisateur (**interaction.member.roles.cache**)
 * @param {Role.id | string} roleID - l'ID du role en question
 * @return {boolean} - si l'utilisateur a le role
 */
module.exports.userARole = (rolesUser, roleID) => {
    return rolesUser.has(roleID);//.valueOf().some((role) => role == roleID); //faut pas mettre "===" car ils ont pas le même type
};