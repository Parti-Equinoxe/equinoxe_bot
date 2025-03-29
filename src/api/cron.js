const cron = require('node-cron');
const client = require("../index.js").client;

module.exports.launch = () => {
    //Tout les dimanches a 9h
    cron.schedule('0 9 * * 0', () => {
        const config = {};
        if (client.configHandler.tryGet("calendars", config)) {
            require("./google.js").rappel(config.value).then(count => console.log(`${count} rappel(s) envoyé(s)`));
        }
    });
    console.log("Cron job launched");
}