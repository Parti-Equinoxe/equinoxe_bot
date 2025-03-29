const { checkMemberRoleCommand } = require("../../api/role");
const { MessageFlags } = require("discord.js");
module.exports = (client, interaction) => {
	if (interaction.isButton()) {
		const args = interaction.customId.split(" ");
		const buttonName = args[0];
		const commandArgs = args.slice(1);
		const button = client.buttons.get(buttonName);

		if (!button) return [false];
		//Vérifie si l'utilisateur est owner en cas de commande admin
		// HACK: ce baser sur les permissions des commands admin. A discuter de si c'est valide.
		if (button.admin && !checkMemberRoleCommand(interaction.member, "admin").allowed) {
			return [false, { content: ":no_entry_sign: Vous n'êtes pas administrateur du bot !", flags: [MessageFlags.Ephemeral] }];
		}
		if (button.userOnly && (interaction.message.interaction && interaction.user.id !== interaction.message.interaction.user.id)) return [false, {
			content: "Vous n'êtes pas originaire de cette commande !",
			flags: [MessageFlags.Ephemeral]
		}];

		if (button.runInteraction.length === 3)
			return [true, (client, interaction) => button.runInteraction(client, interaction, commandArgs)];
		else if (button.runInteraction.length === 2)
			return [true, button.runInteraction];
		else {
			console.warn(`Le bouton est invalide! ${interaction.customId}`);
			return [false, { contien: "La boutton est invalide ! Signaler ce bug.", flags: [MessageFlags.Ephemeral] }];
		}
	}
	//#########################
	const select = client.selects.get(interaction.customId);
	if (!select) return [false];
	//Vérifie si l'utilisateur est owner en cas de commande admin
	// HACK: ce baser sur les permissions des commands admin. A discuter de si c'est valide.
	if (button.admin && !checkMemberRoleCommand(interaction.member, "admin").allowed) {
		return [false, {content: ":no_entry_sign: Vous n'êtes pas administrateur du bot !", flags: [MessageFlags.Ephemeral]}];
	}
	return [true, select.runInteraction];
};