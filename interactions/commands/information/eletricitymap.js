const {EmbedBuilder} = require("discord.js");
const axios = require("axios");
const pays = require("../../../data/electricitymaps/pays.json");
const {numberPretier} = require("../../../api/utils");
const {datatype} = require("../../../api/electricitymaps");

module.exports = {
    name: "électricité",
    description: "Permet d'obtenir les données, en temps réel, des réseaux électrique d'un pays (electricitymaps).",
    options: [
        {
            name: "pays",
            description: "Le pays dont vous voulez voir les données.",
            type: 3,
            default: pays.find(p => p.value === "FR"),
            autocomplete: true
        }
    ],
    runInteraction: async (client, interaction) => {
        if ((await axios.get("https://api.electricitymap.org/health")).data.status !== "ok") return interaction.reply({
            content: ":x: L'API [ElectricityMap](https://app.electricitymaps.com/map) n'est pas accessible. Merci de revenire plus tard.",
            ephemeral: true
        });
        const zone = pays.find(p => p.value === interaction.options.getString("pays")) ?? pays.find(p => p.value === "FR");
        const data = (await axios.get(`https://api.electricitymap.org/v3/power-breakdown/latest?zone=${zone.value}`, {headers: {"auth-token": process.env.TOKEN_EM}})).data;
        data.carbonIntensity = (await axios.get(`https://api.electricitymap.org/v3/carbon-intensity/latest?zone=${zone.value}`, {headers: {"auth-token": process.env.TOKEN_EM}})).data.carbonIntensity;
        data.zone = pays.find(p => p.value === interaction.options.getString("pays")) ?? pays.find(p => p.value === "FR");
        const powerProductionBreakdown = [], powerConsumptionBreakdown = [], carbonIntensityBreakdown = [];
        for (const type of datatype.prodType) {
            powerProductionBreakdown.push({name: type, value: data.powerProductionBreakdown[type] ?? 0});
            powerConsumptionBreakdown.push({name: type, value: data.powerConsumptionBreakdown[type] ?? 0});
            carbonIntensityBreakdown.push({
                name: type,
                value: datatype.emissionType[type] * data.powerProductionBreakdown[type]
            });
        }
        data.powerProductionBreakdown = powerProductionBreakdown;
        data.powerConsumptionBreakdown = powerConsumptionBreakdown;
        data.carbonIntensityBreakdown = carbonIntensityBreakdown;
        const embed = new EmbedBuilder()
            .setDescription(`## ${data.zone.emoji} __${data.zone.name} :__\n`)
            .setColor(rgbTohex(datatype.carbonIntesityColor.find(c => data.carbonIntensity < c.below).color))
            .setFields([{
                name: "Production et consommation électrique :",
                value: `- Consommation/Production : **${numberPretier(data.powerConsumptionTotal * 1000)}W**/**${numberPretier(data.powerProductionTotal * 1000)}W**\n- Import : **${numberPretier(data.powerImportTotal * 1000)}W**\n- Export : **${numberPretier(data.powerExportTotal * 1000)}W**`,
            }, {
                name: "Emission de CO₂ :",
                value: `- Intensité carbonne : **${numberPretier(data.carbonIntensity)}gCO₂eq/kWh**\n- Bas Carbon : **${data.fossilFreePercentage}%**\n- Renouvelable : **${data.renewablePercentage}%**`,
            }])
            .setAuthor({
                name: "ElectricityMap",
                url: `https://app.electricitymaps.com/map/zone/${data.zone.value}`/*, iconURL: "https://app.electricitymaps.com/favicon.ico"*/
            })
            .setFooter({text: "Mis à jour"})
            .setTimestamp(new Date(data.updatedAt));
        return interaction.reply({
            //content: `\`\`\`json\n${JSON.stringify(data, null, 2)}\`\`\``,
            //files: [await graph(data)]
            embeds: [embed]
        });
    },
    runAutocomplete: async (client, interaction) => {
        const focusedOptions = interaction.options.getFocused(true);
        const value = focusedOptions.value.toLowerCase();
        if (`#${value}#` === "##") return interaction.respond(pays.slice(0, 15).map((c) => ({
            name: `${c.emoji} ${c.name}`,
            value: c.value
        })));
        const filtered = pays.filter((c) => c.name.toLowerCase().includes(value));
        const filterLimite = filtered.slice(0, 15);
        await interaction.respond(filterLimite.map((c) => ({name: `${c.emoji} ${c.name}`, value: c.value})));
    }
}

function rgbTohex(rgb) {
    rgb = rgb.replace("rgb(", "").replace(")", "").split(",");
    return `#${parseInt(rgb[0]).toString(16)}${parseInt(rgb[1]).toString(16)}${parseInt(rgb[2]).toString(16)}`
}