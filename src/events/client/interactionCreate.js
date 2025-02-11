const {client} = require("./../../index.js");
const {MessageFlags} = require("discord.js");
const {redBright} = require("cli-color");
const debug = process.env.DEBUG === "true";
const interType = {
    2: require("../../handlers/interactionValidation/command.js"),
    3: require("../../handlers/interactionValidation/component.js"),//Discord ne differencie pas les btns des selects
    4: require("../../handlers/interactionValidation/autocomplete.js"),
    5: require("../../handlers/interactionValidation/modal.js")
};
const interName = {
    2: "commande",
    3: "bouton/select",
    4: "commande auto-complete",
    5: "modal"
};
const {Events} = require("discord.js");
const {getChannel} = require("../../api/utils");
const {salons} = require("../../api/permanent");

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.user.bot) return console.log(`Le bot ${interaction.user.username}(${interaction.user.id}) a tenté de faire une commande !`);
    const inter = await interType[interaction.type](client, interaction);
    if (!inter[0]) return interaction.reply(inter[1] ?? {
        content: "Cette action ne semble pas exister !",
        flags: [MessageFlags.Ephemeral]
    });
    try {
        await inter[1](client, interaction);
        if (debug) console.log(`> ${Date.now() - interaction.createdTimestamp}ms`);
    } catch (err) {
        console.log(redBright.bold(`>> Erreur dans ${interaction.commandName ?? interaction.customId ?? "inconnue"} (${interName[interaction.type] ?? "inconnu"}) :`));
        console.log(err);
        let cmdPing = null;
        if (interaction.isChatInputCommand() && interaction.commandName != undefined) {
            cmdPing = ` (</${interaction.commandName}:${client.application.commands.cache.find((x) => x.name === interaction.command.name).id}>)`;
            if (interaction.options._subcommand ?? false) cmdPing = ` (</${interaction.command.name} ${interaction.options.getSubcommand()}:${client.application.commands.cache.find((x) => x.name === interaction.command.name).id}>)`;
        }
        if (debug) console.log(`> ${Date.now() - interaction.createdTimestamp}ms`);
        if (Date.now() - interaction.createdTimestamp > 3000 && !interaction.deferred) console.log(redBright.bold(`/!\\ Cette interaction a mis plus de 3000ms (${Date.now() - interaction.createdTimestamp}ms)\nL'utilisation de "interaction.deferReply();" est conseiller.`));
        if (interaction.responded || interaction.replied || interaction.deferred) return interaction.editReply({content: "Une erreur s'est produite !" + cmdPing});
        (await getChannel(salons.test_bot)).send({
            content: `## Erreur dans ${interaction.commandName ?? interaction.customId ?? "inconnue"}${cmdPing ?? " (" + interName[interaction.type] + ")"} :\n> User : <@${interaction.user.id}> dans <#${interaction.channelId}>\n\`\`\`console\n${err.stack}\`\`\``,
            allowedMentions: {repliedUser: false}
        });
        return interaction.reply({
            content: "Une erreur s'est produite !" + cmdPing ?? "",
            flags: [MessageFlags.Ephemeral]
        });
    }
});
