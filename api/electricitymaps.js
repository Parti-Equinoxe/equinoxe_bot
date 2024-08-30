const {AttachmentBuilder} = require("discord.js");
const {couleurs} = require("./permanent");
const {ChartJSNodeCanvas} = require("chartjs-node-canvas");
const axios = require("axios");
const pays = require("../data/electricitymaps/pays.json");

const texteColor = 'rgb(220,220,220)';
const carbonIntensityColor = [
    {
        color: 'rgb(93,168,105)',
        below: 30
    },
    {
        color: 'rgb(167,203,103)',
        below: 99
    }, {
        color: 'rgb(241,232,104)',
        below: 299
    }, {
        color: 'rgb(174,120,65)',
        below: 599
    },
    {
        color: 'rgb(59,33,17)',
        below: 999999
    }
]
const prodInfo = [
    {
        type: 'nuclear',
        color: 'rgb(128,100,203)',
        legend: 'Nucléaire'
    },
    {
        type: 'geothermal',
        color: 'rgb(131,62,39)',
        legend: 'Géothermique'
    },
    {
        type: 'biomass',
        color: 'rgb(52,109,70)',
        legend: 'Biomasse'
    },
    {
        type: 'coal',
        color: 'rgb(74,75,78)',
        legend: 'Charbon'
    },
    {
        type: 'wind',
        color: 'rgb(115,177,207)',
        legend: 'Éolien'
    },
    {
        type: 'solar',
        color: 'rgb(207,169,66)',
        legend: 'Solaire'
    },
    {
        type: 'hydro',
        color: 'rgb(54,103,192)',
        legend: 'Hydro'
    },
    {
        type: 'gas',
        color: 'rgb(142,137,123)',
        legend: 'Gaz'
    },
    {
        type: 'oil',
        color: 'rgb(81,71,71)',
        legend: 'Fioul'
    },
    {
        type: 'unknown',
        color: 'rgb(149,150,159)',
        legend: 'Inconnu'
    },
    {
        type: 'hydro discharge',
        color: 'rgb(44,56,177)',
        legend: 'Hydro stockage'
    },
    {
        type: 'battery discharge',
        color: 'rgb(57,93,90)',
        legend: 'Batterie stockage'
    }
]
const prodType = [
    "nuclear",
    "geothermal",
    "biomass",
    "coal",
    "wind",
    "solar",
    "hydro",
    "gas",
    "oil",
    "unknown",
    "hydro discharge",
    "battery discharge",
]
const emissionType = {
    "nuclear": 5,
    "geothermal": 38,
    "biomass": 230,
    "coal": 1000,
    "wind": 13,
    "solar": 30,
    "hydro": 11,
    "gas": 500,
    "oil": 1170,
    "unknown": 700,
    "hydro discharge": 200,
    "battery discharge": 200,
}
module.exports.datatype = {
    carbonIntensityColor: carbonIntensityColor,
    prodColor: prodInfo,
    prodType: prodType,
    emissionType: emissionType
}

module.exports.graphProd = async (dataEM) => {
    //console.log(dataEM);
    const chartJSNodeCanvas = new ChartJSNodeCanvas({
        width: 1000,
        height: 1000,
        backgroundColour: carbonIntensityColor.find(c => dataEM.carbonIntensity < c.below).color,
        plugins: {requireLegacy: ['chartjs-plugin-datalabels']}
    });

    const img = new AttachmentBuilder()
        .setFile(await chartJSNodeCanvas.renderToBuffer({
            type: 'doughnut',
            data: {
                labels: ["nuclear", "geothermal", "biomass", "coal", "wind", "solar", "hydro", "gas", "oil", "unknown", "hydro discharge", "battery discharge"],
                datasets: [{
                    label: "production",
                    data: dataEM.powerProductionBreakdown.map(d => d.value),
                    backgroundColor: prodInfo.map(d => d.color),
                }/*,
                {
                    label: "emission",
                    data: dataEM.carbonIntensityBreakdown.map(d => d.value),
                    backgroundColor: prodColor.map(d => d.color),
                }*/]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: `Production d'électricité de ${dataEM.zone.name}`,
                        fullSize: true,
                        font: {size: 70},
                        //color: couleurs.jaune,
                        padding: {bottom: 40, top: 20}
                    },
                    legend: {
                        display: false,
                        fullSize: true,
                        position: "bottom",
                        align: "end",
                        labels: {font: {size: 30}, color: texteColor, padding: 40,}
                    },
                    datalabels: {
                        formatter: function (value, context) {
                            const totalIndex = context.datasetIndex === 0 ? "powerProductionTotal" : "carbonIntensityTotal";
                            return `${Math.round(context.dataset.data[context.dataIndex] * 1000 / dataEM[totalIndex]) / 10}% - ${prodInfo[context.dataIndex].legend}`;
                        },
                        display: function (context) {
                            const totalIndex = context.datasetIndex === 0 ? "powerProductionTotal" : "carbonIntensityTotal";
                            return context.dataset.data[context.dataIndex] > 2 * dataEM[totalIndex] / 100;
                        },
                        color: 'black',
                        anchor: 'center',
                        align: 'center',
                        font: {size: 20},
                        backgroundColor: 'white',
                        borderRadius: 10,
                    }
                },
                /*layout: {
                    padding: {
                        top: 40,
                        right: 50,
                        bottom: 30,
                        left: 100
                    },
                }*/
            }
        }, "image/png"))
        .setName(`prod-emission-${dataEM.zone.name}.png`);
    //.setDescription(``);
    return img;
}

module.exports.getData = async (zone) => {
    const data = (await axios.get(`https://api.electricitymap.org/v3/power-breakdown/latest?zone=${zone}`, {headers: {"auth-token": process.env.TOKEN_EM}})).data;
    data.carbonIntensity = (await axios.get(`https://api.electricitymap.org/v3/carbon-intensity/latest?zone=${zone}`, {headers: {"auth-token": process.env.TOKEN_EM}})).data.carbonIntensity;
    data.zone = pays.find(p => p.value === zone) ?? pays.find(p => p.value === "FR");
    const powerProductionBreakdown = [], powerConsumptionBreakdown = [], carbonIntensityBreakdown = [];
    for (const type of prodType) {
        powerProductionBreakdown.push({name: type, value: (data.powerProductionBreakdown[type] ?? 0) * 1000000});
        powerConsumptionBreakdown.push({name: type, value: (data.powerConsumptionBreakdown[type] ?? 0) * 1000000});
        carbonIntensityBreakdown.push({
            name: type,
            value: emissionType[type] * data.powerProductionBreakdown[type]
        });
    }
    powerProductionBreakdown.map(t => (t.value = t.value < 0 ? 0 : t.value));
    powerConsumptionBreakdown.map(t => (t.value = t.value < 0 ? 0 : t.value));
    carbonIntensityBreakdown.map(t => (t.value = t.value < 0 ? 0 : t.value));
    data.powerProductionBreakdown = powerProductionBreakdown;
    data.powerConsumptionBreakdown = powerConsumptionBreakdown;
    data.carbonIntensityBreakdown = carbonIntensityBreakdown;
    //data.powerProductionTotal*=1000000;
    //data.powerConsumptionTotal*=1000000;
    data.powerProductionTotal = data.powerProductionBreakdown.reduce((a, b) => a + b.value, 0);
    data.powerConsumptionTotal = data.powerConsumptionBreakdown.reduce((a, b) => a + b.value, 0);
    data.powerImportTotal*=1000000;
    data.powerExportTotal*=1000000;
    return data;
}