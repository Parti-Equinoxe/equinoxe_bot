const {userARole} = require("../../api/role");
const {roles} = require("../../api/permanent");
module.exports = (client, interaction) => {
	const modal = client.modals.get(interaction.customId);
	if (!modal) return [false];
	//Vérifie si l'utilisateur est owner en cas de commande admin
	if (modal.admin && !(userARole(interaction.member.roles.cache, roles.administrateur) || userARole(interaction.member.roles.cache, roles.bureau))) {
		return [false, {content: ":no_entry_sign: Vous n'êtes pas administrateur du bot !", ephemeral: true}];
	}
	return [true, modal.runInteraction];
};