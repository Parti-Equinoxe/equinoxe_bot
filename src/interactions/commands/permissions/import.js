const axios = require("axios");
const {writeFileSync} = require("fs");
const {log, simplify} = require("../../../api/utils.js");
const {MessageFlags} = require("discord.js");
module.exports = {
    name: "import",
    description: "Permet d'appliquer les permission d'un salon.",
    devOnly: true,
    subCommande: true,
    options: [
        {
            name: "nom",
            description: "Le nom du set de permission.",
            type: 3,
            required: true
        },
        {
            name: "description",
            description: "La description du set de permission.",
            type: 3,
            required: true,
        },
        {
            name: "permission",
            description: "Le JSON des permission que vous voulez appliquer.",
            type: 11,
            required: true,
        }
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    runInteraction: async (client, interaction) => {
        if (interaction.options.getAttachment("permission").contentType !== "application/json; charset=utf-8") {
            return interaction.reply({content: ":x: Le fichier doit être au format JSON !", flags: [MessageFlags.Ephemeral]});
        }
        await interaction.deferReply({flags: [MessageFlags.Ephemeral]});
        const dataUrl = await axios({
            url: interaction.options.getAttachment("permission").attachment.toString("utf-8"),
            method: 'GET',
            responseType: 'json',
        }).catch(error => {
            console.log(error)
            return false;
        });
        if (!dataUrl) return interaction.editReply({content: ":inbox_tray: Le fichier n'a pas pu être téléchargé."});
        const permission = dataUrl.data;
        const nom = simplify(interaction.options.getString("nom")).replaceAll(" ", "_");
        const description = interaction.options.getString("description");
        let permissions_set = require("../../../data/utils/permissions_set.json");
        permissions_set.push({
            name: nom,
            description: description,
            permissions: permission
        });
        writeFileSync("./data/utils/permissions_set.json", JSON.stringify(permissions_set, null, 4));
        await log(`__**${nom} :**__\n> ${description}`, "Set de permission importé :", interaction.member, "success");
        return interaction.editReply({content: ":white_check_mark: Le set de permission a bien été importé.",});
    },
}