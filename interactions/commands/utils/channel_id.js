const {ChatInputCommandInteraction, Client} = require("discord.js");

module.exports = {
	name: "salon",
	description: "Permet d'obtenir le \"ping\" du salon.",
	options: [
		{
			name: "salon",
			description: "Le salon que vous souhaitez voir le \"ping\".",
			type: 7,
			required: true
		}
	],
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	runInteraction: async (client, interaction) => {
		const channel = interaction.options.getChannel("salon");
		return interaction.reply({
			content: `<#${channel.id}> : \`\`\`\n<#${channel.id}>\`\`\``,
		});
	},
};
