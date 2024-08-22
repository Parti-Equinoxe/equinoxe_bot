const {EmbedBuilder, AttachmentBuilder} = require("discord.js");
const {couleurs, banniere} = require("../../api/permanent");
module.exports.send = (interaction) => {
    //const vid = new AttachmentBuilder("./data/images/pres_whats_app.mp4").setName("pres_whats_app.mp4");
    //console.log(`attachment://${vid.name}`);
    return {
        embeds: [
            new EmbedBuilder()
                .setDescription(`## Comment rejoindre le groupe WhatsApp de mon département ?\nVous pouvez rejoindre le groupe du parti via le lien reçu par mail, lors de votre adhésion.\nEnsuite rechercher votre département et rejoinez le groupe (vidéo ci-dessous).`)
                //.setImage(`attachment://${vid.name}`)
                .setColor(couleurs.jaune)
                .setThumbnail(banniere.link)
        ],
        files: [banniere.file()]
    }
}