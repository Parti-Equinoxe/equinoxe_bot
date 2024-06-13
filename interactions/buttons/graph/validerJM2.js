const {EmbedBuilder} = require("discord.js");
module.exports = {
    customID: "validerJM2",
    userOnly: true,
    runInteraction: async (client, interaction) => {
        const msgJM = await interaction.channel.messages.fetch(interaction.message.reference.messageId);
        const embedJM = EmbedBuilder.from(msgJM.embeds[0]);
        const data = interaction.message.embeds[0].fields;
        let titre = `${data[0].value} (**${data[1].value}**)`;
        let value = "", nb = parseInt(data[1].value);
        for (const field of data.slice(2, data.length)) {
            value += `${field.name} (**${field.value}**)\n`;
            nb -= parseInt(field.value);
        }
        if (nb<0) {
            interaction.message.delete();
            return interaction.reply({content: ":warning: Vous avez introduit une valeur invalide !\nMerci de recommencer.", ephemeral: true});
        }
        value += `Abstention : (**${nb}**)`;
        embedJM.addFields({name: titre, value: value});
        embedJM.setTimestamp();
        msgJM.components[0].components[0].data.disabled = false;
        msgJM.components[0].components[1].data.disabled = false;
        msgJM.components[0].components[2].data.disabled = false;
        await msgJM.edit({embeds: [embedJM], components: [msgJM.components[0]]});
        return interaction.message.delete()
    }
}