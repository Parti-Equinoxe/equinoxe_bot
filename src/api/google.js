const {google} = require("googleapis");
const {writeFileSync, existsSync} = require("fs");
const {blueBright} = require("cli-color");
const calendarConfig = require("../data/utils/calendar.json");

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
 * @return {Promise<Array<{{id: string, created: Date, updated: Date, start: Date, end: Date, name: string, description: string, roles: Array<String>}>>}
 */
module.exports.nextWeek = async (calID = "SG-CO") => {
    if (calID === "SG-IO") return [];
    const calendar = google.calendar({version: 'v3', auth});
    const timeMin = new Date();
    timeMin.setDate(timeMin.getDate() + 1); // start from tomorrow
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + 7);
    const resp = await calendar.events.list({
        calendarId: calendarConfig.list.find(c => c.id === calID).calendarID,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
    });
    console.log(resp.data);
    const value = resp.data.items.map((event) => {
        return {
            calID: calID,
            id: event.id,
            created: new Date(event.created),
            updated: new Date(event.updated),
            start: new Date(event.start.dateTime),
            end: new Date(event.end.dateTime),
            name: event.summary,
            description: event.description,
            roles: calendarConfig.roles[calID] ?? []
        }
    });
    return value;
}