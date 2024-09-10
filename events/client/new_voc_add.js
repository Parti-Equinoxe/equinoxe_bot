const {ButtonBuilder, ActionRowBuilder, Events} = require("discord.js");
const client = require("../../index").client;
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    if (newState.channel == null || !newState.channel.name.includes("➕")) return;
    const voc = await newState.guild.channels.create({
        name: `🔈│${newState.member.user.username}`,
        parent: newState.channel.parentId,
        type: 2,
        reason:`Nouveau salon vocal depuis <#${newState.channelId}>`,
        //permissionOverwrites: newState.channel.permissionOverwrites.cache
    });
    await newState.member.voice.setChannel(voc.id, `Nouveau salon vocal depuis <#${newState.channelId}>`);
    await voc.send({
        content: `:speaker: Vous pouvez inviter des gens dans le vocal avec : \`\`\`\n<#${voc.id}>\`\`\`\nCe vocal se supprime automatiquement lorsque tout le monde l'aura quitter.\nAttention ce salon sera supprimer (*lorsque tout le monde aura quitter*) alors n'oubliez rien dans la discussion !`,
    })
    const button = new ButtonBuilder()
        .setCustomId("accueil:renomervoc")
        .setLabel("Renommer")
        .setStyle(2)
        .setEmoji("📝");
    await voc.send({
        content: `<@${newState.member.user.id}>, vous pouvez renomer le salon en utilisant le bouton :`,
        components: [new ActionRowBuilder().addComponents(button)]
    });
})