const { google } = require("googleapis");
const { writeFileSync, existsSync } = require("fs");
const { blueBright } = require("cli-color");
const { EmbedBuilder } = require("discord.js");
const { getChannel } = require("./utils.js");

// je suis pas certaint du nom Calendar, cella ne serrait pas plus un evenemnt qu'un callendrier ? @Youritch
// Calendrier > Evenements > Datess/Sessionss
// Cella pourrait peut être rendre moins confusant avec le caledrier google ?
/**
 * @typedef {{
 *       name: string,
 *       color: `#${string}`,
 *       calendarID: string,
 *       role: string,
 *       channel: string
 *     }} Calendar
 */
/**
 * @typedef {{
 *   [key: string]: {
 *     name: string,
 *     color: `#${string}`,
 *     calendarID: string,
 *     role: string,
 *     channel: string
 *   }
 * }} CalendarsConfig
 */
/**
 * @typedef {{id: string,
 *      created: Date,
 *      updated: Date,
 *      start: Date,
 *      end: Date,
 *      name: string,
 *      description: string,
 *      calendar: Calendar,
 *      fullDay: boolean
 *    }} CalendarEvent
 */


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
 * @param events les evenements google associer au calendrier
 * @param calendar le calendrier associer aux evenements
 * @return {Array<CalendarEvent>}
 */
function eventsFormater(events, calendar) {
    return events.items.map((event) => {
        return {
            calendar: calendar,
            id: event.id,
            created: new Date(event.created),
            updated: new Date(event.updated),
            start: new Date(event.start.dateTime ?? event.start.date),
            end: new Date(event.end.dateTime ?? event.end.date),
            name: event.summary,
            description: event.description,
            fullDay: !!event.start.date,
        }
    });
}

/**
 * @param {Calendar} calendar
 * @return {Promise<Array<CalendarEvent>>}
 */
module.exports.nextWeek = async (calendar) => {
    const timeMin = this.weekTimeEnd(new Date(), 1);
    const timeMax = this.weekTimeEnd(timeMin, 1);
    return await this.getEvents(calendar, timeMin, timeMax);
}
/**
 * @param {String} calendar
 * @return {Promise<Array<CalendarEvent>>}
 */
module.exports.thisWeek = async (calendar) => {
    const timeMin = new Date();
    const timeMax = this.weekTimeEnd(timeMin, 1);
    return await this.getEvents(calendar, timeMin, timeMax);
}

/**
 * @param {Calendar} calendar
 * @param {Date} start
 * @param {Date} end
 * @return {Promise<Array<CalendarEvent>>}
 */
module.exports.getEvents = async (calendar, start, end) => {
    const googleCalendar = google.calendar({version: 'v3', auth});
    const resp = await googleCalendar.events.list({
        calendarId: calendar.calendarID,
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
    });
    return eventsFormater(resp.data, calendar);
}
/**
 * @param {Array<CalendarEvent>} events
 * @return {EmbedBuilder}
 */
module.exports.embedEvents = (events) => {
    events.sort((a, b) => a.start.getTime() - b.start.getTime());
    return new EmbedBuilder()
        .setColor(events[0].calendar.color)
        .setFields(events.slice(0, 20).map((event) => {
            let textDate = `Le <t:${Math.round(event.start.getTime() / 1000)}:D> de <t:${Math.round(event.start.getTime() / 1000)}:t> à <t:${Math.round(event.end.getTime() / 1000)}:t>`;
            if (event.fullDay) textDate = `Le <t:${Math.round(event.start.getTime() / 1000)}:D>` + (event.end.getTime() - event.start.getTime() > 86400000 ? ` au <t:${Math.round(event.end.getTime() / 1000)}:D>` : "");
            return {
                name: event.name,
                value: `${textDate}.\n> ${event.description ?? "Pas de description."}\nÉquipe : <@&${event.calendar.role}>`
            }
        }))
        .setTimestamp();
}
/**
 * @param {} event
 * @return {EmbedBuilder}
 */
module.exports.embedEvent = (event) => {
    let textDate = `Le <t:${Math.round(event.start.getTime() / 1000)}:D> de <t:${Math.round(event.start.getTime() / 1000)}:t> à <t:${Math.round(event.end.getTime() / 1000)}:t>`;
    if (event.fullDay) textDate = `Le <t:${Math.round(event.start.getTime() / 1000)}:D>` + (event.end.getTime() - event.start.getTime() > 86400000 ? ` au <t:${Math.round(event.end.getTime() / 1000)}:D>` : "");
    return new EmbedBuilder()
        .setTitle(event.name)
        .setDescription(`${textDate}.\n> ${event.description ?? "Pas de description."}\nÉquipe : <@&${event.calendar.role}>`)
        .setColor(event.calendar.color)
        .setTimestamp();
}

/**
 * Envoie les events dans leurs salons respectifs, est utilise par cron
 * @param {CalendarConfig} calendars
 * @return {Promise<number>}
 */
module.exports.rappel = async (calendars) => {
    let count = 0;
    for (const calendar of Object.values(calendars)) {
        const timeMin = new Date();
        const timeMax = this.weekTimeEnd(timeMin, 1);

        const events = await this.getEvents(calendar, timeMin, timeMax);
        if (events.length === 0) continue;
        console.log(events);
        const channel = await getChannel(events[0].calendar.channel);
        const embeds = events.slice(0, 10).map(cal => this.embedEvent(cal));
        await channel.send({
            content: `## Réunion(s) du <t:${Math.round(timeMin.getTime() / 1000)}:d> au <t:${Math.round(timeMax.getTime() / 1000)}:d>`,
            embeds: embeds
        });
        count += embeds.length;
    }
    return count;
}
/**
 * @param {Date} start
 * @param {number} nb
 * @return {Date}
 */
module.exports.weekTimeEnd = (start, nb = 1) => {
    const timeMax = new Date(start);
    timeMax.setDate(timeMax.getDate() + 7 * nb - start.getDay());
    timeMax.setHours(23, 59, 59);
    return timeMax;
}