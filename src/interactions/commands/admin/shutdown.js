const {redBright} = require("cli-color");
const {ChatInputCommandInteraction, Client, MessageFlags} = require("discord.js");

module.exports = {
	name: "stop",
	description: "Une commande pour stopper le bot.",
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	runInteraction: async (client, interaction) => {
		if (process.env.DEV_MODE === "true") return interaction.reply({
			content: `:x: Commande indisponible en mode dev.`,
			flags: [MessageFlags.Ephemeral]
		});
		await interaction.reply("Shutdown du bot !");
		console.log(redBright.bold(`>> Shutdown (par ${interaction.user.username})! <<`));
		await client.destroy();
		process.exit(2);
	},
};
