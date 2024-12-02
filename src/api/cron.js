const cron = require('node-cron');

module.exports.launch = () => {
    //Tout les dimanches a 9h
    cron.schedule('0 9 * * 0', () => {
        require("./google.js").rappel().then(count => console.log(`${count} rappel(s) envoyé(s)`));
    });
    console.log("Cron job launched");
}