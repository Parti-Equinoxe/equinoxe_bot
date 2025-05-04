const {AttachmentBuilder} = require("discord.js");
const {ChartJSNodeCanvas} = require("chartjs-node-canvas");
const {couleurs} = require("./permanent.js");
const label = ["Éxcellent", "Bien", "Passable", "Insuffisant", "À rejeter", "Abstention"];
const backgroundColor = [
    'rgb(73,117,40)',
    'rgb(121,166,90)',
    'rgb(187,215,164)',
    'rgb(240,160,57)',
    'rgb(234,50,36)',
    'rgb(220,220,220)'
];
const texteColor = 'rgb(220,220,220)';
//, pourcents: [number, number, number, number, number, number], mentionMajoritaire: number
/**
 * Draws the chart
 * @param {string} titre - The title of the vote
 * @param {Array<{titre: string, nb: number, votes: [number, number, number, number, number, number]}>} data - The list of data
 * @returns {Promise<AttachmentBuilder>} - The data with the "majority" property added, indicating if the note is part of the majority.
 */
module.exports.voteJugementMajoritaire = async (titre, data) => {
    for (const vote of data) {
        const pourcents = vote.votes.map((v) => Math.round(v * 1000 / (vote.nb - vote.votes[5])) * 0.1);
        let mentionMajoritaire = 0, sum = pourcents[0];
        while (sum < 50) {
            mentionMajoritaire++;
            sum += Math.abs(pourcents[mentionMajoritaire]);
        }
        pourcents[5] *= -1;
        vote.pourcents = pourcents;
        vote.mentionMajoritaire = mentionMajoritaire;
    }
    const datasets = [];
    for (const i in label) {
        datasets.push({
            label: label[i],
            data: data.map((vote) => vote.pourcents[i]),
            backgroundColor: backgroundColor[i],
        });
    }
    const chartJSNodeCanvas = new ChartJSNodeCanvas({
        width: 3200,
        height: 120 * data.length + 400,
        backgroundColour: couleurs.noir,
        plugins: {requireLegacy: ['chartjs-plugin-datalabels']}
    });
    const img = new AttachmentBuilder()
        .setFile(await chartJSNodeCanvas.renderToBuffer({
            type: 'bar',
            data: {
                labels: data.map((vote) => vote.titre),
                datasets: datasets
            },
            options: {
                indexAxis: 'y',
                scales: {
                    y: {
                        stacked: true,
                        ticks: {
                            font: {size: 40},
                            color: texteColor,
                            callback: (value) => `${data[value].titre} - (${label[data[value].mentionMajoritaire]})`,
                            padding: 50
                        },
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        stacked: true,
                        min: Math.floor(Math.min(...(datasets[5].data))),
                        max: 100,
                        //grace: 0.1,
                        ticks: {
                            stepSize: 1,
                            callback: (value, index) => {
                                if (value % 25 === 0 || index === 0) return `${Math.abs(value)}%`;
                            },
                            font: {size: 40},
                            color: texteColor,
                            padding: 20
                        },
                        grid: {
                            color: texteColor,
                            lineWidth: 2,
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: titre,
                        fullSize: true,
                        font: {size: 70},
                        color: couleurs.jaune,
                        padding: {bottom: 40, top: 20}
                    },
                    legend: {
                        fullSize: true,
                        position: "top",
                        align: "end",
                        labels: {font: {size: 40}, color: texteColor, padding: 40,}
                    },
                    datalabels: {
                        formatter: function (value, context) {
                            return `${Math.abs(data[context.dataIndex].votes[context.datasetIndex])}`;
                        },
                        display: function (context) {
                            return context.dataset.data[context.dataIndex] !== 0;
                        },
                        color: 'black',
                        anchor: 'center',
                        align: 'center',
                        font: {size: 35},
                        backgroundColor: 'white',
                        borderRadius: 10,
                    }
                },
                layout: {
                    padding: {
                        top: 40,
                        right: 50,
                        bottom: 30,
                        left: 100
                    },
                }
            }
        }, "image/png"))
        .setName(`vote_result.png`)
        .setDescription(titre);
    return img;
}

/**
 * Draws the chart
 * @param {string} titre - The title of the vote
 * @param {Array<{departement: string, circonscription: string,prenom: string, nom: string, pourcentage: string, vote: number}>} data - The list of data
 * @returns {Promise<AttachmentBuilder>} - The data with the "majority" property added, indicating if the note is part of the majority.
 */
module.exports.voteLegislative = async (titre, data) => {
    const labels = data.map((v) => {
        return `${v.prenom} ${v.nom} - ${v.circonscription} ${v.departement}`;
    });
    const dataset = {
        label: "% dans la circonscription",
        data: data.map((v) => {
            return parseFloat(v.pourcentage.replace("%", ""));
        }),
        backgroundColor: couleurs.jaune
    }
    const chartJSNodeCanvas = new ChartJSNodeCanvas({
        width: 200 * data.length + 400,
        height: 2000,
        backgroundColour: couleurs.noir,
        plugins: {requireLegacy: ['chartjs-plugin-datalabels']}
    });
    const img = new AttachmentBuilder()
        .setFile(await chartJSNodeCanvas.renderToBuffer({
            type: 'bar',
            data: {
                labels: labels,
                datasets: [dataset]
            },
            options: {
                scales: {
                    y: {
                        ticks: {
                            font: {size: 40},
                            color: texteColor,
                            padding: 50
                        },
                    },
                    x: {
                        grid: {
                            color: texteColor,
                            lineWidth: 2,
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: titre,
                        fullSize: true,
                        font: {size: 70},
                        color: couleurs.jaune,
                        padding: {bottom: 40, top: 20}
                    },
                    legend: {
                        fullSize: true,
                        position: "top",
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
                        color: 'black',
                        anchor: 'center',
                        align: 'center',
                        font: {size: 35},
                        backgroundColor: 'white',
                        borderRadius: 10,
                    }*/
                },
                layout: {
                    padding: {
                        top: 40,
                        right: 50,
                        bottom: 30,
                        left: 100
                    },
                }
            }
        }, "image/png"))
        .setName(`vote_result.png`)
        .setDescription(titre);
    return img;
}