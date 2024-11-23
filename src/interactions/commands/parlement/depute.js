const {getDeputes, searchDepute, getDeputeInfoByID, getDeputeInfoBySlug} = require("../../../api/nosdepute");
const {EmbedBuilder} = require("discord.js");
module.exports = {
    name: "député",
    description: "Permet d'obtenir des informations sur un député.",
    subCommande: true,
    options: [
        {
            name: "nom",
            description: "Le nom du député.",
            type: 3,
            required: true,
            autocomplete: true
        }
    ],
    runInteraction: async (client, interaction) => {
        await interaction.deferReply();
        const result = (await searchDepute(interaction.options.getString("nom")))[0] ?? false;
        const info = await getDeputeInfoBySlug(result.slug);
        const embed = new EmbedBuilder()
            .setTitle(info.nom)
            .setDescription(`Place dans l'hémicycle : **${info.place_en_hemicycle}**`)
            .setFields([
                {
                    name: "Mandat :",
                    value: `Circonception : **${info.num_circo} ${info.nom_circo}**\nDu **${info.mandat_debut}** au **${info.mandat_fin}**`,
                    inline: true
                },
                {
                    name: "Parti :",
                    value: `${info.parti_ratt_financier}`,
                    inline: true
                },
                {
                    name: "Profession :",
                    value: `${info.profession ?? "Non renseigné"}`,
                },
                {
                    name: "Site web :",
                    value: `- [Fiche Assemblé Nationale](${info.url_an})\n`+info.sites_web.map(s=>`- ${s}`).join("\n")
                }
            ])
            .setURL(`https://www.nosdeputes.fr/${result.slug}`)
            .setColor("#00ffff")
            .setThumbnail(`https://www.nosdeputes.fr/depute/photo/${result.slug}/128`)
            .setFooter({text: "Données de NosDéputés.fr"});
        return interaction.editReply({embeds: [embed]});
    },
    runAutocomplete: async (client, interaction) => {
        const focusedOptions = interaction.options.getFocused(true).value;
        const choiceRaw = await searchDepute(focusedOptions);
        const choices = choiceRaw.map((c) => ({name: c.nom, value: c.slug}));
        try {
            await interaction.respond(choices);
        } catch (e) {
            console.log(e);
        }
    }
}
//NosDéputés.fr