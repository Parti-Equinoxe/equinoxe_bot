const {ChartJSNodeCanvas} = require("chartjs-node-canvas");
const {AttachmentBuilder} = require("discord.js");
const {EmbedBuilder} = require("discord.js");
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
module.exports = {
    customID: "validerJM",
    userOnly: true,
    runInteraction: async (client, interaction) => {
        await interaction.deferReply();
        const votes = interaction.message.embeds[0].fields.map((field) => {
            const voteMention = field.value.split("\n").map((field) => parseInt(field.split("**")[1]) ?? 0);
            const nb_votant = parseInt(field.name.split("**")[1]);
            voteMention[5] *= -1;
            const nb_vote = nb_votant + voteMention[5];
            const pourcents = voteMention.map((vote) => Math.round(vote * 1000 / nb_vote) * 0.1);
            let mentionMajoritaire = 0, sum = pourcents[0];
            while (sum < 50) {
                mentionMajoritaire++;
                sum += Math.abs(pourcents[mentionMajoritaire]);
            }
            return {
                titre: field.name.split("(**")[0].trim(),
                nb: nb_votant,
                votes: voteMention,
                pourcents: pourcents,
                mentionMajoritaire: mentionMajoritaire
            }
        });
        const datasets = [];
        for (const i in label) {
            datasets.push({
                label: label[i],
                data: votes.map((vote) => vote.pourcents[i]),
                backgroundColor: backgroundColor[i]
            });
        }
        const chartJSNodeCanvas = new ChartJSNodeCanvas({
            width: 3000,
            height: 120 * votes.length + 400,
            backgroundColour: 'rgb(25,23,28)',
            plugins: {requireLegacy: ['chartjs-plugin-datalabels']}
        });
        const img = new AttachmentBuilder()
            .setFile(await chartJSNodeCanvas.renderToBuffer({
                type: 'bar',
                data: {
                    labels: votes.map((vote) => vote.titre),
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
                                callback: (value) => `${votes[value].titre} - (${label[votes[value].mentionMajoritaire]})`,
                                padding: 30
                            },
                            grid: {
                                display: false
                            }
                        },
                        x: {
                            stacked: true,
                            min: Math.min(...(datasets[5].data)),
                            max: 100,
                            ticks: {
                                stepSize: 25,
                                callback: (value) => `${Math.abs(value)}%`,
                                font: {size: 35},
                                color: texteColor,
                            },
                            grid: {
                                color: texteColor,
                                lineWidth: 2,
                            },
                            title: {
                                display: true,
                                text: "Mention : ",
                                color: texteColor,
                                font: {size: 50, style: "bold"}
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: interaction.message.embeds[0].title,
                            fullSize: true,
                            font: {size: 60},
                            color: "#ffd412",
                            padding: {bottom: 40, top: 20}
                        },
                        legend: {
                            fullSize: true,
                            position: 'bottom',
                            labels: {font: {size: 40}, color: texteColor, padding: 20}
                        },
                        datalabels: {
                            formatter: function (value, context) {
                                return `${votes[context.dataIndex].votes[context.datasetIndex]}`;
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
                            top: 30,
                            right: 50,
                            bottom: 30,
                            left: 100
                        },
                    }
                }
            }, "image/png"))
            .setName(`vote_result.png`)
            .setDescription("Résultat d'un vote au jugement majoritaire.");
        interaction.editReply({files: [img]})
    }
}