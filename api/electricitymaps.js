const {AttachmentBuilder} = require("discord.js");
const {couleurs} = require("./permanent");
const {ChartJSNodeCanvas} = require("chartjs-node-canvas");

const texteColor = 'rgb(220,220,220)';
const carbonIntesityColor = [
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
        color: 'rgb(59,33,11)',
        below: 999999
    }
]
const prodColor = [
    {
        type: 'nuclear',
        color: 'rgb(93,168,105)'
    },
    {
        type: 'geothermal',
        color: 'rgb(131,62,39)'
    },
    {
        type: 'biomass',
        color: 'rgb(52,109,70)'
    },
    {
        type: 'coal',
        color: 'rgb(74,75,78)'},
    {
        type: 'wind',
        color: 'rgb(115,177,207)'
    },
    {
        type: 'solar',
        color: 'rgb(207,169,66)'
    },
    {
        type: 'hydro',
        color: 'rgb(54,103,192)'
    },
    {
        type: 'gas',
        color: 'rgb(142,137,123)'
    },
    {
        type: 'oil',
        color: 'rgb(81,71,71)'
    },
    {
        type: 'unknown',
        color: 'rgb(149,150,159)'
    },
    {
        type: 'hydro discharge',
        color: 'rgb(44,56,177)'
    },
    {
        type: 'battery discharge',
        color: 'rgb(57,93,90)'
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
    carbonIntesityColor: carbonIntesityColor,
    prodColor: prodColor,
    prodType: prodType,
    emissionType: emissionType
}

module.exports.graph = async (dataEM) => {
    console.log(dataEM);
    const chartJSNodeCanvas = new ChartJSNodeCanvas({
        width: 1000,
        height: 1000,
        backgroundColour: carbonIntesityColor.find(c => dataEM.carbonIntensity < c.below).color,
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
                    backgroundColor: prodColor.map(d => d.color),
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
                        fullSize: true,
                        position: "bottom",
                        align: "end",
                        labels: {font: {size: 40}, color: texteColor, padding: 40,}
                    },
                    /*datalabels: {
                        formatter: function (value, context) {
                            return `${Math.abs(data[context.dataIndex].votes[context.datasetIndex])}`;
                        },
                        display: function (context) {
                            return context.dataset.data[context.dataIndex] !== 0;
                        },
                        //color: 'black',
                        anchor: 'center',
                        align: 'center',
                        font: {size: 35},
                        //backgroundColor: 'white',
                        borderRadius: 10,
                    }*/
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
