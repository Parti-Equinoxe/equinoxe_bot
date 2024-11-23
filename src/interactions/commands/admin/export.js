const {simplify} = require("../../../api/utils.js");
const {writeFileSync} = require("fs");
const dsg = {
    roles: "roles",
    salons: "channels"
}
const tests = {
    roles: (r) => true,
    salons: (r) => !r.isThread() && r.parentId !== "1250122963085430936" && r.parentId !== null
}
module.exports = {
    name: "export",
    description: "Permet d'exporter les informations du serveur.",
    options: [
        {
            name: "champs",
            description: "Ce qui doit être export",
            type: 3,
            required: true,
            choices: [
                {
                    name: "roles",
                    value: "roles"
                },
                {
                    name: "salons",
                    value: "salons"
                }
            ]
        }
    ],
    devOnly: true,
    runInteraction: async (client, interaction) => {
        if (process.env.DEV_MODE === "true" || !client.config.dev.include(interaction.user.id)) return interaction.reply({
            content: `:x: Commande disponible seulement en mode dev.`,
            ephemeral: true
        });
        const type = interaction.options.getString("champs");
        const registered = Object.values(require(`../../../data/utils/${type}.json`));
        console.log(registered);
        const data = interaction.guild[dsg[type]].cache.map((r) => {
            return {
                data: r,
                name: simplify(r.name).replaceAll('│', '').trim().toLowerCase().replaceAll(/[ -]/g, "_"),
                id: r.id
            }
        }).filter((r) => tests[type](r.data))
            .filter((r) => !registered.includes(r.id));
        const file = require(`../../../data/utils/${type}.json`);
        for (const role of data) {
            file[role.name] = role.id;
        }
        writeFileSync(`./data/utils/${type}.json`, JSON.stringify(file, null, 4));
        return interaction.reply({
            content: `**${data.length}** ${type} ajouté`,
            ephemeral: true
        });
    }
}