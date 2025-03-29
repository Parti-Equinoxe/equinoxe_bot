const { userAnyRoles, checkMemberRoleCommand } = require("../../api/role");
module.exports = (client, interaction) => {
	const modal = client.modals.get(interaction.customId);
	if (!modal) return [false];
	//Vérifie si l'utilisateur est owner en cas de commande admin
	// HACK: ce baser sur les permissions des commands admin. A discuter de si c'est valide.
	if (button.admin && !checkMemberRoleCommand(interaction.member, "admin").allowed) {
		return [false, {content: ":no_entry_sign: Vous n'êtes pas administrateur du bot !", ephemeral: true}];
	}
	return [true, modal.runInteraction];
};