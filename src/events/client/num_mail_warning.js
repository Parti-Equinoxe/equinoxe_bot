const {client} = require("../../index");
const {Events, ButtonBuilder, ActionRowBuilder} = require("discord.js");
const regExMail = new RegExp(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gm);
// piqué sur https://stackoverflow.com/a/46127278
const regExNum = new RegExp(/^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/gm);
//const regExSupNum = new RegExp(/\b\d{12,}\b/gm);

client.safelyOn(Events.MessageCreate, alert);
client.safelyOn(Events.MessageUpdate, (old, newM) => alert(newM))

async function alert(message){
    if (message.author.bot) return;
    const mail = message.content.match(regExMail), num = message.content.match(regExNum);
    if (!mail && !num) return;
    const btnSup = new ButtonBuilder()
        .setCustomId("autre:sup_mail_num")
        .setEmoji("🗑")
        .setLabel("Supprimer")
        .setStyle(4);
    const btnIgn = new ButtonBuilder()
        .setCustomId("autre:sup_msg_ref")
        .setEmoji("✔️")
        .setLabel("Ignorer")
        .setStyle(3);
    return message.reply({
        content: `:warning: Il n'est pas conseillé de partager **${mail ? "un email" : ""}${mail && num ? " ou " : ""}${num ? "un numéro de téléphone" : ""}**.\n Vous pouvez utiliser le bouton ci-dessous pour ignorer cette alerte ou pour supprimer votre message.`,
        components: [new ActionRowBuilder().addComponents(btnIgn).addComponents(btnSup)]
    });
}