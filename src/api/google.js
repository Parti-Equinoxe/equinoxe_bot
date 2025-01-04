const {google} = require("googleapis");
const {writeFileSync, existsSync} = require("fs");
const {blueBright} = require("cli-color");
const calendarConfig = require("../data/utils/calendar.json");
const {EmbedBuilder} = require("discord.js");
const {roles, salons} = require("./permanent");
const {getChannel} = require("./utils");

function saveAuthFile() {
    const sak = {
        type: "service_account",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/agenda-equinoxe%40project-agenda-440618.iam.gserviceaccount.com",
        universe_domain: "googleapis.com",
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        project_id: process.env.GOOGLE_PROJECT_ID
    }
    writeFileSync("service-account-key.json", JSON.stringify(sak, null, 4));
}

if (process.env.DEV_MODE === "false" || !existsSync("service-account-key.json")) {
    console.log(blueBright.bold("Initialisation service-account-key.json"))
    saveAuthFile();
}
const auth = new google.auth.GoogleAuth({
    keyFile: 'service-account-key.json',
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});

/**
 * @param events
 * @return {Array<{id: string, created: Date, updated: Date, start: Date, end: Date, name: string, description: string, roles: Array<String>, calendar: Object}>}
 */
function eventsFormater(events) {
    const cal = calendarConfig.list.find(c => c.name === events.summary);
    console.log(cal);
    return events.items.map((event) => {
        return {
            calendar: cal,
            id: event.id,
            created: new Date(event.created),
            updated: new Date(event.updated),
            start: new Date(event.start.dateTime),
            end: new Date(event.end.dateTime),
            name: event.summary,
            description: event.description,
        }
    });
}

/**
 * @param {String} calID
 * @return {Promise<Array<{id: string, created: Date, updated: Date, start: Date, end: Date, name: string, description: string, roles: Array<String>, calendar: Object}>>}
 */
module.exports.nextWeek = async (calID) => {
    const timeMin = this.weekTimeEnd(new Date(), 1);
    const timeMax = this.weekTimeEnd(timeMin, 1);
    return await this.getEvents(calID, timeMin, timeMax);
}
/**
 * @param {String} calID
 * @return {Promise<Array<{id: string, created: Date, updated: Date, start: Date, end: Date, name: string, description: string, roles: Array<String>, calendar: Object}>>}
 */
module.exports.thisWeek = async (calID) => {
    const timeMin = new Date();
    const timeMax = this.weekTimeEnd(timeMin, 1);
    return await this.getEvents(calID, timeMin, timeMax);
}

/**
 * @param {String} calID
 * @param {Date} start
 * @param {Date} end
 * @return {Promise<Array<{id: string, created: Date, updated: Date, start: Date, end: Date, name: string, description: string, roles: Array<String>, calendar: Object}>>}
 */
module.exports.getEvents = async (calID, start, end) => {
    const calendar = google.calendar({version: 'v3', auth});
    const resp = await calendar.events.list({
        calendarId: calendarConfig.list.find(c => c.id === calID).calendarID,
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
    });
    return eventsFormater(resp.data);
}
/**
 * @param {Array<{id: string, created: Date, updated: Date, start: Date, end: Date, name: string, description: string, roles: Array<String>, calendar: Object}>} events
 * @return {EmbedBuilder}
 */
module.exports.embedEvents = (events) => {
    events.sort((a, b) => a.start.getTime() - b.start.getTime());
    console.log(events);
    return new EmbedBuilder()
        .setColor(events[0].calendar.color)
        .setFields(events.slice(0, 20).map((event) => {
            return {
                name: event.name,
                value: `Le <t:${Math.round(event.start.getTime() / 1000)}:D> de <t:${Math.round(event.start.getTime() / 1000)}:t> à <t:${Math.round(event.end.getTime() / 1000)}:t>.\n> ${event.description ?? "Pas de description."}\nÉquipe : <@&${roles[event.calendar.role]}>`
            }
        }))
        .setTimestamp();
}
/**
 * @param {{id: string, created: Date, updated: Date, start: Date, end: Date, name: string, description: string, roles: Array<String>, calendar: Object}} event
 * @return {EmbedBuilder}
 */
module.exports.embedEvent = (event) => {
    return new EmbedBuilder()
        .setTitle(event.name)
        .setDescription(`Le <t:${Math.round(event.start.getTime() / 1000)}:D> de <t:${Math.round(event.start.getTime() / 1000)}:t> à <t:${Math.round(event.end.getTime() / 1000)}:t>.\n> ${event.description ?? "Pas de description."}\nÉquipe : <@&${roles[event.calendar.role]}>`)
        .setColor(event.calendar.color)
        .setTimestamp();
}

module.exports.rappel = async () => {
    let count = 0;
    for (const cal of calendarConfig.list) {
        const timeMin = new Date();
        const timeMax = this.weekTimeEnd(timeMin, 1);

        const events = await this.getEvents(cal.id, timeMin, timeMax);
        if (events.length === 0) continue;

        const channel = await getChannel(salons[events[0].calendar.channel]);
        const embeds = events.slice(0, 10).map(cal => this.embedEvent(cal))
        await channel.send({
            content: `## Réunion(s) du <t:${Math.round(timeMin.getTime() / 1000)}:d> au <t:${Math.round(timeMax.getTime() / 1000)}:d>`,
            embeds: embeds
        });
        count+=embeds.length;
    }
    return count;
}

module.exports.weekTimeEnd = (start, nb = 1) => {
    const timeMax = new Date(start);
    timeMax.setDate(timeMax.getDate() + 7 * nb - start.getDay());
    timeMax.setHours(23, 59, 59);
    return timeMax;
}