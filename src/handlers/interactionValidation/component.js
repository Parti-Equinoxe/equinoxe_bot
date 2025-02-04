const {userARole} = require("../../api/role");
const {roles} = require("../../api/permanent");
const {MessageFlags} = require("discord.js");
module.exports = (client, interaction) => {
	if (interaction.isButton()) {
		const button = client.buttons.get(interaction.customId);
		if (!button) return [false];
		//Vérifie si l'utilisateur est owner en cas de commande admin
		if (button.admin && !(userARole(interaction.member.roles.cache, roles.administrateur) || userARole(interaction.member.roles.cache, roles.bureau))) {
			return [false, {content: ":no_entry_sign: Vous n'êtes pas administrateur du bot !", flags: [MessageFlags.Ephemeral]}];
		}
		if (button.userOnly && ( interaction.message.interaction && interaction.user.id !== interaction.message.interaction.user.id)) return [false, {
			content: "Vous n'êtes pas originaire de cette commande !",
			flags: [MessageFlags.Ephemeral]
		}];
		return [true, button.runInteraction];
	}
	//#########################
	const select = client.selects.get(interaction.customId);
	if (!select) return [false];
	//Vérifie si l'utilisateur est owner en cas de commande admin
	if (select.admin && !(userARole(interaction.member.roles.cache, roles.administrateur) || userARole(interaction.member.roles.cache, roles.bureau))) {
		return [false, {content: ":no_entry_sign: Vous n'êtes pas administrateur du bot !", flags: [MessageFlags.Ephemeral]}];
	}
	return [true, select.runInteraction];
};