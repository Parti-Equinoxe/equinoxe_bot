//Template made with love by Here-Template (https://github.com/here-template)
require("dotenv").config();
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const configPath = process.env.DEBUG === "true" ? "./configDebug.json" : "./config.json";
const {greenBright, redBright} = require("cli-color");
const configFile = require(configPath);
const ConfigHandler = require("./api/configHandler.js");

// Asure une documentation pour le client.
// Si il au autre solution que d'héritée l'Client je suis preneur
/**
 * CustomClient est une classe personnalisée qui étend la classe Client de Discord.js.
 * Elle est utilisée pour gérer les fonctionnalités spécifiques du bot, y compris la gestion
 * des commandes, des interactions, et la configuration.
 *
 * @extends {Client}
 */
class CustomClient extends Client {
    constructor(options) {
        super(options);

        //Mise en cache de la config :
        /**
         * L'objet de configuration chargé depuis le fichier de configuration.
         * @type {Object}
         */
        this.config = configFile;

        /**
         * L'instance du gestionnaire de configuration pour gérer le fichier de configuration.
         * @type {ConfigHandler}
         */
        this.configHandler = new ConfigHandler(configPath);

        //Création des collections discords pour les handlers :
        /**
         * Une Collection de Discord.js pour stocker les gestionnaires de commandes.
         * @type {Collection}
         */
        this.commands = new Collection();

        /**
         * Une Collection de Discord.js pour stocker les gestionnaires d'interactions de boutons.
         * @type {Collection}
         */
        this.buttons = new Collection();

        /**
         * Une Collection de Discord.js pour stocker les gestionnaires de menus déroulants.
         * @type {Collection}
         */
        this.selects = new Collection();

        /**
         * Une Collection de Discord.js pour stocker les gestionnaires de modaux.
         * @type {Collection}
         */
        this.modals = new Collection();
    }

    /**
     * Attacher un event handler à un event en le wrappant dans un try/catch.
     * @param {*} event l'event à s'attacher
     * @param {(...args) => void} listener l'event handler
     */
    safelyOn(event, listener) {
        this.on(event, (...args) => {
            try {
                listener(...args);
            } catch (error) {
                console.error(`An error occurred in the '${event}' event listener:`, error);
            }
        });
    }

    /**
     * Attacher un event handler à un event en le wrappant dans un try/catch.
     * @param {*} event l'event à s'attacher
     * @param {(...args) => void} listener l'event handler
     */
    safelyOnce(event, listener) {
        this.once(event, (...args) => {
            try {
                listener(...args);
            } catch (error) {
                console.error(`An error occurred in the '${event}' event listener:`, error);
            }
        });
    }

}

const client = new CustomClient({
    intents: [
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel, Partials.User, Partials.Reaction, Partials.Message, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.ThreadMember],
});
//export du client
module.exports.client = client;

const version = "1.0.0";

console.log(greenBright.bold.underline("Lancement du bot :"));

//config bdd :
if (configFile.bdd) {
    require("./api/bdd.js");
}

//Chargement en mémoire des handlers :
["command", "event", "button", "select", "modal"].forEach(async (handler) => {
    await require(`./handlers/preload/${handler}`)(client);
});
console.log(greenBright.bold.underline("Connection à discord… (v" + version + ")"));
//Connection du bot :
client.login(process.env.TOKEN).catch((reason) => {
    console.log(redBright.bold("La connection à discord à échoué !"));
    switch (reason.code) {
        case "ENOTFOUND":
            console.log(redBright("> Erreur de connection (vérifier votre connection à internet) !"));
            process.exit(1);
        case "TokenInvalid":
            console.log(redBright("> Token invalide (vérifier votre token sur https://discord.com/developers/applications et dans le fichier .ENV) !"));
            process.exit(1);
        default:
            if (process.env.DEBUG === "false") console.log(reason);
            break;
    }
    if (process.env.DEBUG === "true") console.log(reason);
});

//Demarrage connection Google API :
require("./api/google.js");
require("./api/cron.js").launch();

//"node-html-to-image": "^3.4.0",
