const {redBright} = require("cli-color");
const {ChatInputCommandInteraction, Client, MessageFlags} = require("discord.js");

module.exports = {
	name: "reboot",
	description: "Une commande pour redémarrer le bot et mettre à jour son code.",
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	runInteraction: async (client, interaction) => {
		if (process.env.DEV_MODE === "true") return interaction.reply({
			content: `:x: Commande indisponible en mode dev.`,
			flags: [MessageFlags.Ephemeral]
		});
		await interaction.reply("Redémarrage du bot !");
		console.log(redBright.bold(`>> Reboot (par ${interaction.user.username})! <<`));
		await client.destroy();
		process.exit(0);
	},
};
