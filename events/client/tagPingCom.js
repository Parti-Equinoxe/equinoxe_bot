const {client} = require("../../index");
const {Events} = require("discord.js");
const {salons, roles} = require("../../api/permanent");
const tagToPing = {
    //creation contenu:
    "1282285783788552327": roles.equipe_graphiste,
    "1282285835278094399": roles.equipe_monteur,
    "1282285936754954250": roles.equipe_redacteur,
    "1282285978542805086": roles.equipe_audio
}
const fait = ["1282349736413888624", "1282349676657512549","1287319737239601203"];

client.on(Events.ThreadCreate, async (thread) => {
    if (thread.parentId !== salons.creation_contenu) return;
    const text = thread.appliedTags.map((t) => {
        if (tagToPing[t] === undefined) return "";
        return `<@&${tagToPing[t]}>`
    }).join(" ");
    if (text !== "") await thread.send({
        content: ":wrench: " + text + "\nIl ya du travail !!"
    });
    return;
});
client.on(Events.ThreadUpdate, async (oldThread, newThread) => {
    if (newThread.parentId !== salons.creation_contenu && newThread.parentId !== salons.demande_mail) return;
    if (oldThread.appliedTags.join("") === newThread.appliedTags.join("")) return;
    if (!newThread.appliedTags.includes(fait[0]) && !newThread.appliedTags.includes(fait[1]) && !newThread.appliedTags.includes(fait[2])) return;
    await newThread.send({content: "Super bravo à tous !\n:lock: Ce post est maintenant archivé !!"});
    return newThread.setArchived(true, "Travail terminer");
});